from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
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
    category: str  # "law" or "protocol"

class RuleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Vienna RP - Laws & Protocols API"}

# ============ RULES ENDPOINTS ============

# Get all laws
@api_router.get("/laws", response_model=List[Rule])
async def get_laws():
    rules = await db.rules.find({"category": "law"}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    
    # Convert ISO strings to datetime if needed
    for rule in rules:
        if isinstance(rule.get('created_at'), str):
            rule['created_at'] = datetime.fromisoformat(rule['created_at'])
        if isinstance(rule.get('updated_at'), str):
            rule['updated_at'] = datetime.fromisoformat(rule['updated_at'])
    
    return rules

# Get all protocols
@api_router.get("/protocols", response_model=List[Rule])
async def get_protocols():
    rules = await db.rules.find({"category": "protocol"}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    
    # Convert ISO strings to datetime if needed
    for rule in rules:
        if isinstance(rule.get('created_at'), str):
            rule['created_at'] = datetime.fromisoformat(rule['created_at'])
        if isinstance(rule.get('updated_at'), str):
            rule['updated_at'] = datetime.fromisoformat(rule['updated_at'])
    
    return rules

# Get single rule by ID
@api_router.get("/rules/{rule_id}", response_model=Rule)
async def get_rule(rule_id: str):
    rule = await db.rules.find_one({"id": rule_id}, {"_id": 0})
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    # Convert ISO strings to datetime if needed
    if isinstance(rule.get('created_at'), str):
        rule['created_at'] = datetime.fromisoformat(rule['created_at'])
    if isinstance(rule.get('updated_at'), str):
        rule['updated_at'] = datetime.fromisoformat(rule['updated_at'])
    
    return rule

# Create new rule
@api_router.post("/rules", response_model=Rule)
async def create_rule(rule_input: RuleCreate):
    if rule_input.category not in ["law", "protocol"]:
        raise HTTPException(status_code=400, detail="Category must be 'law' or 'protocol'")
    
    rule_dict = rule_input.model_dump()
    rule = Rule(**rule_dict)
    
    # Convert to dict and serialize datetimes for MongoDB
    doc = rule.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.rules.insert_one(doc)
    return rule

# Update rule
@api_router.put("/rules/{rule_id}", response_model=Rule)
async def update_rule(rule_id: str, rule_update: RuleUpdate):
    existing_rule = await db.rules.find_one({"id": rule_id}, {"_id": 0})
    if not existing_rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    update_data = rule_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.rules.update_one({"id": rule_id}, {"$set": update_data})
    
    updated_rule = await db.rules.find_one({"id": rule_id}, {"_id": 0})
    
    # Convert ISO strings to datetime
    if isinstance(updated_rule.get('created_at'), str):
        updated_rule['created_at'] = datetime.fromisoformat(updated_rule['created_at'])
    if isinstance(updated_rule.get('updated_at'), str):
        updated_rule['updated_at'] = datetime.fromisoformat(updated_rule['updated_at'])
    
    return updated_rule

# Delete rule
@api_router.delete("/rules/{rule_id}")
async def delete_rule(rule_id: str):
    result = await db.rules.delete_one({"id": rule_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"message": "Rule deleted successfully"}

# ============ STATUS CHECK ENDPOINTS (legacy) ============

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()