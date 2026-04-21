from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel, Field
from typing import List
import uuid

# تحميل البيانات من البيئة (تأكد إنك ضايف MONGO_URL في Vercel Settings)
load_dotenv()
client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME', 'vienna_db')]

app = FastAPI()

# حل مشكلة الفشل في الحفظ نهائياً
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# المسارات اللي كانت تطلع لك Not Found
@app.get("/api/laws")
async def get_laws():
    return await db.rules.find({"category": "law"}, {"_id": 0}).to_list(1000)

@app.post("/api/laws")
async def create_law(data: dict):
    new_law = {
        "id": str(uuid.uuid4()),
        "title": data['title'],
        "content": data['content'],
        "category": "law"
    }
    await db.rules.insert_one(new_law)
    return {"status": "success"}

@app.get("/api/protocols")
async def get_protocols():
    return await db.rules.find({"category": "protocol"}, {"_id": 0}).to_list(1000)

@app.post("/api/protocols")
async def create_protocol(data: dict):
    new_proto = {
        "id": str(uuid.uuid4()),
        "title": data['title'],
        "content": data['content'],
        "category": "protocol"
    }
    await db.rules.insert_one(new_proto)
    return {"status": "success"}
