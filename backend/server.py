from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()

# إعدادات CORS - تسمح لموقعك في Vercel بالاتصال الكامل
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # مسموح للكل مؤقتاً لضمان اشتغال الحفظ
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# --- Models ---
class Rule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    category: str  # "law" or "protocol"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RuleCreate(BaseModel):
    title: str
    content: str

class RuleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

# --- الأكواد المصلحة للربط مع اللوحة ---

# جلب القوانين
@api_router.get("/laws", response_model=List[Rule])
async def get_laws():
    rules = await db.rules.find({"category": "law"}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return rules

# إضافة قانون جديد
@api_router.post("/laws", response_model=Rule)
async def create_law(rule_input: RuleCreate):
    rule = Rule(title=rule_input.title, content=rule_input.content, category="law")
    doc = rule.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.rules.insert_one(doc)
    return rule

# جلب البروتوكولات
@api_router.get("/protocols", response_model=List[Rule])
async def get_protocols():
    rules = await db.rules.find({"category": "protocol"}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return rules

# إضافة بروتوكول جديد
@api_router.post("/protocols", response_model=Rule)
async def create_protocol(rule_input: RuleCreate):
    rule = Rule(title=rule_input.title, content=rule_input.content, category="protocol")
    doc = rule.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.rules.insert_one(doc)
    return rule

# حذف أي عنصر (قانون أو بروتوكول)
@api_router.delete("/laws/{rule_id}")
@api_router.delete("/protocols/{rule_id}")
@api_router.delete("/rules/{rule_id}")
async def delete_item(rule_id: str):
    result = await db.rules.delete_one({"id": rule_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Deleted successfully"}

# تعديل أي عنصر
@api_router.put("/laws/{rule_id}")
@api_router.put("/protocols/{rule_id}")
async def update_item(rule_id: str, rule_update: RuleUpdate):
    update_data = rule_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.rules.update_one({"id": rule_id}, {"$set": update_data})
    return await db.rules.find_one({"id": rule_id}, {"_id": 0})

app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
