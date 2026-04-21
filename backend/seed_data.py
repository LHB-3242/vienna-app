"""
Seed script to populate initial laws and protocols data
Run: python seed_data.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

LAWS_DATA = [
    {
        "id": str(uuid.uuid4()),
        "title": "المادة الأولى - التعريفات الأساسية",
        "content": "يُقصد بأمن الدولة في هذا القانون الحفاظ على استقرار الدولة وحماية مؤسساتها الدستورية وصون النظام العام والأمن الوطني. يشمل ذلك حماية المواطنين والمقيمين من أي تهديدات داخلية أو خارجية قد تؤثر على سلامتهم أو حقوقهم المشروعة.",
        "category": "law",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "المادة الثانية - الجرائم ضد أمن الدولة",
        "content": "يُعاقب بالسجن مدة لا تقل عن خمس سنوات كل من ارتكب فعلاً من الأفعال التالية:\n\n1. التخابر مع دولة أجنبية أو جهة معادية بقصد الإضرار بمصالح الدولة\n2. تسريب معلومات سرية تتعلق بالأمن القومي\n3. القيام بأعمال تخريبية تستهدف المنشآت الحيوية\n4. تكوين أو الانضمام لجماعات تهدف لزعزعة الأمن\n5. نشر شائعات كاذبة بقصد إثارة الفتنة والبلبلة",
        "category": "law",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "المادة الثالثة - حماية المعلومات السرية",
        "content": "تُعتبر المعلومات التالية سرية ولا يجوز الإفصاح عنها إلا بإذن رسمي من الجهات المختصة:\n\n• الوثائق والمعلومات المتعلقة بالدفاع والأمن الوطني\n• خطط وعمليات القوات المسلحة والأجهزة الأمنية\n• المعلومات الاستخباراتية والتحقيقات الجنائية\n• البيانات المتعلقة بالبنية التحتية الحساسة\n\nيُعاقب كل من يخالف هذه المادة بالسجن والغرامة.",
        "category": "law",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "المادة الرابعة - صلاحيات أجهزة الأمن",
        "content": "يحق لأجهزة الأمن المختصة اتخاذ الإجراءات التالية عند الاشتباه في تهديد لأمن الدولة:\n\n1. إجراء التحقيقات اللازمة وجمع الأدلة\n2. القبض على المشتبه بهم بموجب أمر قضائي\n3. تفتيش المنازل والمنشآت بإذن من النيابة العامة\n4. فرض قيود على التنقل في حالات الطوارئ\n5. مراقبة الاتصالات بموجب إذن قضائي\n\nويجب أن تتم جميع هذه الإجراءات وفقاً للقانون واحترام حقوق الإنسان.",
        "category": "law",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "المادة الخامسة - عقوبات إضافية",
        "content": "بالإضافة إلى العقوبات الأساسية، يجوز للمحكمة أن تحكم بواحدة أو أكثر من العقوبات التكميلية التالية:\n\n• المصادرة: مصادرة الأموال والممتلكات المستخدمة في الجريمة\n• الحرمان من الحقوق: حرمان المحكوم عليه من بعض الحقوق المدنية لمدة محددة\n• المنع من السفر: منع المحكوم عليه من مغادرة البلاد\n• الإبعاد: إبعاد الأجانب المحكوم عليهم عن البلاد\n• نشر الحكم: نشر الحكم في الصحف على نفقة المحكوم عليه",
        "category": "law",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

PROTOCOLS_DATA = [
    {
        "id": str(uuid.uuid4()),
        "title": "بروتوكول التعامل مع التهديدات الإرهابية",
        "content": "في حالة تلقي معلومات عن تهديد إرهابي محتمل، يجب اتباع الخطوات التالية:\n\n1. إبلاغ غرفة العمليات المركزية فوراً\n2. تفعيل خطة الطوارئ وتحديد مستوى التهديد\n3. نشر الفرق الأمنية في المناطق الحساسة\n4. إخلاء المدنيين من مناطق الخطر المحتملة\n5. التنسيق مع جميع الأجهزة الأمنية ذات العلاقة\n6. تأمين المنشآت الحيوية والبنية التحتية\n7. إطلاع الجهات العليا بشكل مستمر\n8. تنفيذ خطة الاستجابة السريعة\n\nيجب تنفيذ هذا البروتوكول بأقصى سرعة ودقة.",
        "category": "protocol",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "بروتوكول حماية الشخصيات المهمة",
        "content": "تتطلب حماية الشخصيات المهمة (VIP) اتباع إجراءات صارمة:\n\n• الفحص الأمني المسبق لجميع الأماكن التي سيزورها الشخص المحمي\n• تأمين خطوط السير البديلة\n• استخدام مركبات مدرعة مجهزة بأحدث التقنيات\n• وجود فريق حماية شخصية مدرب على أعلى مستوى\n• استخدام معدات كشف المتفجرات والأسلحة\n• التنسيق مع أجهزة الأمن المحلية\n• وضع خطط إخلاء طارئة\n• المراقبة الإلكترونية المستمرة\n• تشويش الاتصالات إذا لزم الأمر\n\nأي خرق لهذا البروتوكول يُعد مخالفة جسيمة.",
        "category": "protocol",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "بروتوكول الاستجابة للكوارث الطبيعية",
        "content": "عند حدوث كارثة طبيعية، يجب تفعيل البروتوكول التالي:\n\n1. تقييم حجم الكارثة ونطاقها\n2. إعلان حالة الطوارئ في المناطق المتأثرة\n3. تفعيل مراكز الإيواء المؤقتة\n4. نشر فرق الإنقاذ والإسعاف\n5. قطع الخدمات الخطرة (كهرباء، غاز) في المناطق المتضررة\n6. فتح ممرات آمنة للإخلاء\n7. التنسيق مع المنظمات الإنسانية\n8. توفير الإمدادات الطبية والغذائية\n9. إنشاء مراكز للمعلومات والتواصل\n10. البدء بعمليات الإصلاح والترميم\n\nالسرعة في التنفيذ تنقذ الأرواح.",
        "category": "protocol",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "بروتوكول الأمن السيبراني",
        "content": "لحماية البنية التحتية الرقمية للدولة، يجب اتباع الإجراءات التالية:\n\n• مراقبة الشبكات الحيوية على مدار الساعة\n• تحديث أنظمة الحماية والجدران النارية بشكل دوري\n• إجراء اختبارات اختراق دورية\n• تدريب الموظفين على الأمن السيبراني\n• عزل الأنظمة الحساسة عن الإنترنت\n• تشفير جميع البيانات الحساسة\n• إنشاء نسخ احتياطية منتظمة\n• الاستجابة الفورية للهجمات\n• التعاون مع شركات الأمن السيبراني العالمية\n• التحقيق في أي خرق أمني\n\nالهجمات السيبرانية تهديد حقيقي يتطلب يقظة مستمرة.",
        "category": "protocol",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

async def seed_database():
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await db.rules.delete_many({})
    print("✅ Cleared existing rules")
    
    # Insert laws
    if LAWS_DATA:
        await db.rules.insert_many(LAWS_DATA)
        print(f"✅ Inserted {len(LAWS_DATA)} laws")
    
    # Insert protocols
    if PROTOCOLS_DATA:
        await db.rules.insert_many(PROTOCOLS_DATA)
        print(f"✅ Inserted {len(PROTOCOLS_DATA)} protocols")
    
    # Verify
    laws_count = await db.rules.count_documents({"category": "law"})
    protocols_count = await db.rules.count_documents({"category": "protocol"})
    
    print(f"\n📊 Database Status:")
    print(f"   - Laws: {laws_count}")
    print(f"   - Protocols: {protocols_count}")
    print(f"   - Total: {laws_count + protocols_count}")
    print("\n🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
