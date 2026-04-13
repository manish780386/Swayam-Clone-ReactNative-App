"""
Run: python seed_data.py
Isse sari sample data DB mein aa jayegi
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'swayam_project.settings')
django.setup()

from apps.users.models import User
from apps.courses.models import Category, Institution, Course, CourseWeek
from apps.notifications.models import Notification

print("🌱 Seeding database...")

# ── Categories ──────────────────────────────────────────
cats = [
    {"name": "Engineering & Technology", "slug": "engineering", "icon": "⚙️",  "color": "#1565C0", "bg_color": "#E3F2FD"},
    {"name": "Maths & Sciences",         "slug": "maths",       "icon": "🔬",  "color": "#6A1B9A", "bg_color": "#F3E5F5"},
    {"name": "Management & Commerce",    "slug": "management",  "icon": "📊",  "color": "#E65100", "bg_color": "#FFF3E0"},
    {"name": "Humanities & Arts",        "slug": "humanities",  "icon": "🎭",  "color": "#880E4F", "bg_color": "#FCE4EC"},
    {"name": "Health Sciences",          "slug": "health",      "icon": "🏥",  "color": "#1B5E20", "bg_color": "#E8F5E9"},
    {"name": "Law",                      "slug": "law",         "icon": "⚖️",  "color": "#37474F", "bg_color": "#ECEFF1"},
    {"name": "Energy & Sustainability",  "slug": "energy",      "icon": "🌱",  "color": "#004D40", "bg_color": "#E0F2F1"},
    {"name": "Design",                   "slug": "design",      "icon": "🎨",  "color": "#BF360C", "bg_color": "#FBE9E7"},
    {"name": "Teacher Education",        "slug": "teacher",     "icon": "📚",  "color": "#1A237E", "bg_color": "#E8EAF6"},
    {"name": "Architecture & Planning",  "slug": "architecture","icon": "🏛️",  "color": "#4E342E", "bg_color": "#EFEBE9"},
    {"name": "NPTEL Domain",             "slug": "nptel",       "icon": "🎓",  "color": "#0D47A1", "bg_color": "#E3F2FD"},
    {"name": "School Education",         "slug": "school",      "icon": "🏫",  "color": "#1B5E20", "bg_color": "#E8F5E9"},
]
for c in cats:
    Category.objects.get_or_create(slug=c['slug'], defaults=c)
print(f"✅ {len(cats)} categories created")

# ── Institutions ─────────────────────────────────────────
insts = [
    {"name": "Indian Institute of Technology Madras",   "short_name": "IIT Madras",   "city": "Chennai",   "type": "IIT"},
    {"name": "Indian Institute of Technology Delhi",    "short_name": "IIT Delhi",    "city": "Delhi",     "type": "IIT"},
    {"name": "Indian Institute of Technology Bombay",   "short_name": "IIT Bombay",   "city": "Mumbai",    "type": "IIT"},
    {"name": "Indian Institute of Technology Kharagpur","short_name": "IIT Kharagpur","city": "Kharagpur", "type": "IIT"},
    {"name": "Indian Institute of Management Ahmedabad","short_name": "IIM Ahmedabad","city": "Ahmedabad", "type": "IIM"},
    {"name": "National Law University Delhi",           "short_name": "NLU Delhi",    "city": "Delhi",     "type": "Central"},
    {"name": "Jawaharlal Nehru University",             "short_name": "JNU Delhi",    "city": "Delhi",     "type": "Central"},
    {"name": "All India Institute of Medical Sciences", "short_name": "AIIMS Delhi",  "city": "Delhi",     "type": "Central"},
    {"name": "Indian Institute of Science Bangalore",   "short_name": "IISc Bangalore","city": "Bangalore","type": "Central"},
    {"name": "IIIT Hyderabad",                          "short_name": "IIIT Hyderabad","city": "Hyderabad","type": "Other"},
]
for i in insts:
    Institution.objects.get_or_create(short_name=i['short_name'], defaults=i)
print(f"✅ {len(insts)} institutions created")

# ── Courses ───────────────────────────────────────────────
from datetime import date
courses_data = [
    {
        "title": "Introduction to Machine Learning", "slug": "intro-ml",
        "description": "Comprehensive intro to ML algorithms, supervised/unsupervised learning, neural networks and real-world Python applications.",
        "category_slug": "engineering", "institution_short": "IIT Madras",
        "instructor": "Prof. Rahul Sharma", "icon": "🤖", "color": "#1565C0",
        "level": "Intermediate", "language": "English", "credits": 4, "duration_weeks": 12,
        "start_date": date(2026,1,13), "end_date": date(2026,4,6), "exam_date": date(2026,4,20),
        "tags": ["Python","Neural Networks","Deep Learning"], "enrolled_count": 45230,
        "weeks": ["Introduction & Python Basics","Linear Regression","Logistic Regression",
                  "Decision Trees & Random Forest","SVM & Naive Bayes","Unsupervised Learning",
                  "Neural Networks Basics","Deep Learning","CNNs & Image Recognition",
                  "RNNs & NLP","Model Evaluation","Project & Deployment"],
    },
    {
        "title": "Data Structures and Algorithms", "slug": "dsa",
        "description": "Master fundamental data structures — arrays, trees, graphs, heaps — and classic algorithms with complexity analysis.",
        "category_slug": "engineering", "institution_short": "IIT Delhi",
        "instructor": "Prof. Anita Gupta", "icon": "📊", "color": "#2E7D32",
        "level": "Beginner", "language": "English", "credits": 4, "duration_weeks": 8,
        "start_date": date(2026,5,5), "end_date": date(2026,6,27), "exam_date": date(2026,7,5),
        "tags": ["C++","Java","Algorithms"], "enrolled_count": 62100,
        "weeks": ["Arrays & Strings","Linked Lists","Stacks & Queues","Trees","Graphs",
                  "Sorting Algorithms","Searching & Hashing","Dynamic Programming"],
    },
    {
        "title": "Microeconomics: Policy & Theory", "slug": "microeconomics",
        "description": "Explores demand, supply, market structures, game theory, welfare economics, and Indian policy applications.",
        "category_slug": "management", "institution_short": "IIM Ahmedabad",
        "instructor": "Prof. Vimal Rao", "icon": "📈", "color": "#6A1B9A",
        "level": "Intermediate", "language": "English/Hindi", "credits": 3, "duration_weeks": 10,
        "start_date": date(2026,5,5), "end_date": date(2026,7,10), "exam_date": date(2026,7,18),
        "tags": ["Economics","Policy","Markets"], "enrolled_count": 31500,
        "weeks": ["Demand & Supply","Consumer Theory","Producer Theory","Market Structures",
                  "Game Theory","Externalities","Public Goods","Welfare Economics",
                  "Indian Economic Policy","Case Studies"],
    },
    {
        "title": "Renewable Energy Systems", "slug": "renewable-energy",
        "description": "Solar, wind, hydro, and biomass systems, grid integration, storage technologies, and policy frameworks.",
        "category_slug": "energy", "institution_short": "IIT Bombay",
        "instructor": "Prof. Rajan Das", "icon": "⚡", "color": "#00695C",
        "level": "Intermediate", "language": "English", "credits": 3, "duration_weeks": 9,
        "start_date": date(2026,5,12), "end_date": date(2026,7,11), "exam_date": date(2026,7,20),
        "tags": ["Solar","Wind","Grid Integration"], "enrolled_count": 28900,
        "weeks": ["Energy Basics","Solar PV Systems","Solar Thermal","Wind Energy",
                  "Hydro Power","Biomass","Grid Integration","Energy Storage","Policy & Finance"],
    },
    {
        "title": "Advanced Calculus & Linear Algebra", "slug": "calculus-linear-algebra",
        "description": "Multivariable calculus, vector spaces, eigenvalues, Fourier analysis, engineering & physics applications.",
        "category_slug": "maths", "institution_short": "IIT Kharagpur",
        "instructor": "Prof. Dinesh Patel", "icon": "∫", "color": "#1A237E",
        "level": "Advanced", "language": "English", "credits": 4, "duration_weeks": 12,
        "start_date": date(2026,5,5), "end_date": date(2026,7,25), "exam_date": date(2026,8,1),
        "tags": ["Calculus","Linear Algebra","Mathematics"], "enrolled_count": 38600,
        "weeks": ["Limits & Continuity","Partial Derivatives","Multiple Integrals","Vector Calculus",
                  "Vector Spaces","Linear Transformations","Eigenvalues","Fourier Series",
                  "Laplace Transform","PDE Basics","Numerical Methods","Applications"],
    },
    {
        "title": "Health Nutrition & Preventive Medicine", "slug": "health-nutrition",
        "description": "Fundamentals of human nutrition, dietary guidelines, disease prevention, and public health strategies.",
        "category_slug": "health", "institution_short": "AIIMS Delhi",
        "instructor": "Dr. Priya Nair", "icon": "🏥", "color": "#1B5E20",
        "level": "Beginner", "language": "English/Hindi", "credits": 3, "duration_weeks": 8,
        "start_date": date(2026,5,12), "end_date": date(2026,7,4), "exam_date": date(2026,7,12),
        "tags": ["Nutrition","Health","Medicine"], "enrolled_count": 55100,
        "weeks": ["Introduction to Nutrition","Macronutrients","Micronutrients","Diet Planning",
                  "Lifestyle Diseases","Preventive Care","Public Health","Case Studies"],
    },
    {
        "title": "Artificial Intelligence Fundamentals", "slug": "ai-fundamentals",
        "description": "Search algorithms, knowledge representation, planning, ML foundations, and AI ethics.",
        "category_slug": "engineering", "institution_short": "IISc Bangalore",
        "instructor": "Prof. Sanjay Krishnan", "icon": "🧠", "color": "#0D47A1",
        "level": "Intermediate", "language": "English", "credits": 4, "duration_weeks": 10,
        "start_date": date(2026,5,5), "end_date": date(2026,7,10), "exam_date": date(2026,7,18),
        "tags": ["AI","Search","Planning"], "enrolled_count": 72000,
        "weeks": ["Intro to AI","Uninformed Search","Informed Search","CSP",
                  "Knowledge Representation","Planning","Machine Learning","Deep Learning",
                  "NLP Basics","AI Ethics & Future"],
    },
    {
        "title": "Design Thinking & Innovation", "slug": "design-thinking",
        "description": "Human-centered design, prototyping, empathy mapping, and innovation frameworks.",
        "category_slug": "design", "institution_short": "IIIT Hyderabad",
        "instructor": "Prof. Kavita Reddy", "icon": "🎨", "color": "#BF360C",
        "level": "Beginner", "language": "English", "credits": 2, "duration_weeks": 6,
        "start_date": date(2026,5,19), "end_date": date(2026,6,27), "exam_date": date(2026,7,5),
        "tags": ["Design","Innovation","UX"], "enrolled_count": 19800,
        "weeks": ["Empathise","Define","Ideate","Prototype","Test","Scale & Future"],
    },
    {
        "title": "Business Law & Corporate Ethics", "slug": "business-law",
        "description": "Contract law, company law, IPR, competition law, ethics in Indian corporate governance.",
        "category_slug": "law", "institution_short": "NLU Delhi",
        "instructor": "Prof. Sonal Mehta", "icon": "⚖️", "color": "#37474F",
        "level": "Beginner", "language": "English", "credits": 4, "duration_weeks": 11,
        "start_date": date(2026,5,5), "end_date": date(2026,7,18), "exam_date": date(2026,7,26),
        "tags": ["Law","Ethics","Corporate"], "enrolled_count": 22400,
        "weeks": ["Intro to Law","Contract Law","Company Law","IPR","Consumer Law",
                  "Competition Law","Labour Law","Environmental Law","Corporate Governance",
                  "Ethics","Case Studies"],
    },
    {
        "title": "Cloud Computing & DevOps", "slug": "cloud-devops",
        "description": "AWS, Azure, GCP fundamentals, Docker, Kubernetes, and CI/CD pipelines.",
        "category_slug": "engineering", "institution_short": "IIIT Hyderabad",
        "instructor": "Prof. Amit Saxena", "icon": "☁️", "color": "#1565C0",
        "level": "Intermediate", "language": "English", "credits": 4, "duration_weeks": 8,
        "start_date": date(2026,5,12), "end_date": date(2026,7,4), "exam_date": date(2026,7,12),
        "tags": ["Cloud","Docker","Kubernetes"], "enrolled_count": 41200,
        "weeks": ["Cloud Basics","AWS Core","Azure Fundamentals","GCP Overview",
                  "Docker","Kubernetes","CI/CD","Security & Monitoring"],
    },
]

for cd in courses_data:
    category    = Category.objects.get(slug=cd.pop('category_slug'))
    institution = Institution.objects.get(short_name=cd.pop('institution_short'))
    weeks_list  = cd.pop('weeks', [])
    course, created = Course.objects.get_or_create(
        slug=cd['slug'],
        defaults={**cd, 'category': category, 'institution': institution}
    )
    if created:
        for i, title in enumerate(weeks_list, start=1):
            CourseWeek.objects.create(course=course, week_number=i, title=title)
print(f"✅ {len(courses_data)} courses created")

# ── Global Notifications ──────────────────────────────────
notifs = [
    {"type":"exam",         "title":"SWAYAM Exam Season Open",    "message":"Register for Jan-Apr 2026 exams now. Deadline: Apr 30, 2026.","icon":"📝","color":"#1565C0","is_global":True},
    {"type":"announcement", "title":"New Courses Added",           "message":"10 new courses from IITs and IIMs added for May 2026 semester.","icon":"🚀","color":"#6A1B9A","is_global":True},
    {"type":"announcement", "title":"Platform Update v2.0",        "message":"SWAYAM app updated with offline viewing, faster search, and dark mode.","icon":"🔧","color":"#455A64","is_global":True},
    {"type":"certificate",  "title":"Certificates Ready",          "message":"Jan-Apr 2025 semester certificates are available for download.","icon":"🎓","color":"#2E7D32","is_global":True},
]
for n in notifs:
    Notification.objects.get_or_create(title=n['title'], is_global=True, defaults=n)
print(f"✅ {len(notifs)} global notifications created")

# ── Demo User ─────────────────────────────────────────────
if not User.objects.filter(email='manish@swayam.in').exists():
    user = User.objects.create_user(
        email='manish@swayam.in', password='swayam123',
        full_name='Manish Dange', mobile='+91 9876543210',
        city='Indore', institution='SVVV Indore',
    )
    print(f"✅ Demo user: manish@swayam.in / swayam123")
else:
    print("ℹ️  Demo user already exists")

# ── Superuser ─────────────────────────────────────────────
if not User.objects.filter(email='admin@swayam.in').exists():
    User.objects.create_superuser(
        email='admin@swayam.in', password='admin123', full_name='SWAYAM Admin'
    )
    print("✅ Superuser: admin@swayam.in / admin123")

print("\n🎉 Database seeded successfully!")
print("👉 Run: python manage.py runserver")
print("👉 Admin: http://localhost:8000/admin/")
print("👉 API Docs: http://localhost:8000/api/docs/")