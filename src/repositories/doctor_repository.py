"""Doctor records, hardcoded until a database exists.

Photos are randomuser.me placeholder portraits — deterministic per doctor, and
the single field to change when real headshots are stored locally.
"""

from src.models.doctor import Doctor

_PHOTO_BASE = "https://randomuser.me/api/portraits"


def _photo(gender: str, index: int) -> str:
    return f"{_PHOTO_BASE}/{gender}/{index}.jpg"


_DOCTORS: tuple[Doctor, ...] = (
    Doctor(
        id="anjali-menon",
        name="Dr. Anjali Menon",
        title="MBBS, MD (Endocrinology)",
        specialities=("diabetes", "thyroid"),
        location="Chennai",
        languages=("English", "Tamil", "Malayalam"),
        experience_years=14,
        photo_url=_photo("women", 44),
        bio=(
            "Anjali has spent most of her career helping people bring type 2 diabetes under "
            "control without upending their lives. She works in small, sustainable changes "
            "rather than sweeping restrictions, and sees a lot of thyroid alongside it."
        ),
        consultation_fee=800,
        rating=4.8,
        review_count=412,
        available_days=("Mon", "Tue", "Thu", "Fri"),
    ),
    Doctor(
        id="rahul-iyer",
        name="Dr. Rahul Iyer",
        title="MBBS, MD (Dermatology)",
        specialities=("skin", "hair"),
        location="Bengaluru",
        languages=("English", "Kannada", "Hindi"),
        experience_years=11,
        photo_url=_photo("men", 32),
        bio=(
            "Rahul treats chronic skin conditions — eczema, psoriasis, stubborn acne — and "
            "pattern hair loss. He is careful about what actually has evidence behind it and "
            "will say so when a treatment does not."
        ),
        consultation_fee=700,
        rating=4.6,
        review_count=289,
        available_days=("Mon", "Wed", "Fri", "Sat"),
    ),
    Doctor(
        id="priya-nair",
        name="Dr. Priya Nair",
        title="MBBS, DM (Nephrology)",
        specialities=("kidney", "diabetes"),
        location="Kochi",
        languages=("English", "Malayalam"),
        experience_years=17,
        photo_url=_photo("women", 68),
        bio=(
            "Priya specialises in slowing the progression of chronic kidney disease, most "
            "often in patients who also live with diabetes. She spends real time on diet and "
            "medication review before considering anything more invasive."
        ),
        consultation_fee=1000,
        rating=4.9,
        review_count=534,
        available_days=("Tue", "Wed", "Thu"),
    ),
    Doctor(
        id="vikram-desai",
        name="Dr. Vikram Desai",
        title="MBBS, DM (Hepatology)",
        specialities=("liver", "digestive"),
        location="Mumbai",
        languages=("English", "Hindi", "Marathi", "Gujarati"),
        experience_years=20,
        photo_url=_photo("men", 75),
        bio=(
            "Vikram sees fatty liver disease more than anything else, and is direct about the "
            "fact that most of it is reversible. He also manages hepatitis and long-running "
            "digestive complaints that have not responded to first-line treatment."
        ),
        consultation_fee=1200,
        rating=4.7,
        review_count=618,
        available_days=("Mon", "Thu", "Fri"),
    ),
    Doctor(
        id="sneha-reddy",
        name="Dr. Sneha Reddy",
        title="MBBS, MS (Obstetrics & Gynaecology)",
        specialities=("reproductive",),
        location="Hyderabad",
        languages=("English", "Telugu", "Hindi"),
        experience_years=9,
        photo_url=_photo("women", 12),
        bio=(
            "Sneha works in fertility and PCOS management, and is used to patients arriving "
            "after several inconclusive opinions. She is unhurried in consultations and "
            "explains what each test is actually for."
        ),
        consultation_fee=900,
        rating=4.8,
        review_count=347,
        available_days=("Mon", "Tue", "Wed", "Sat"),
    ),
    Doctor(
        id="arjun-kapoor",
        name="Dr. Arjun Kapoor",
        title="MBBS, DM (Cardiology)",
        specialities=("heart",),
        location="Delhi",
        languages=("English", "Hindi", "Punjabi"),
        experience_years=22,
        photo_url=_photo("men", 51),
        bio=(
            "Arjun handles everything from a first raised blood pressure reading to post-"
            "infarction follow-up. His view is that most cardiac risk is managed years before "
            "it becomes cardiac treatment."
        ),
        consultation_fee=1500,
        rating=4.9,
        review_count=871,
        available_days=("Tue", "Thu", "Sat"),
    ),
    Doctor(
        id="meera-krishnan",
        name="Dr. Meera Krishnan",
        title="MBBS, MD (General Medicine)",
        specialities=("diabetes", "thyroid", "heart"),
        location="Chennai",
        languages=("English", "Tamil"),
        experience_years=12,
        photo_url=_photo("women", 23),
        bio=(
            "Meera is a generalist by choice — most of her patients arrive with two or three "
            "overlapping conditions rather than one clean problem, and she prefers managing "
            "the whole picture over splitting it across specialists."
        ),
        consultation_fee=650,
        rating=4.7,
        review_count=402,
        available_days=("Mon", "Tue", "Wed", "Thu", "Fri"),
    ),
    Doctor(
        id="sanjay-gupta",
        name="Dr. Sanjay Gupta",
        title="MBBS, MS (Orthopaedics)",
        specialities=("joints",),
        location="Pune",
        languages=("English", "Hindi", "Marathi"),
        experience_years=18,
        photo_url=_photo("men", 86),
        bio=(
            "Sanjay treats osteoarthritis, frozen shoulder and sports injuries, with a strong "
            "bias toward physiotherapy and load management before surgery is discussed."
        ),
        consultation_fee=850,
        rating=4.5,
        review_count=256,
        available_days=("Mon", "Wed", "Fri"),
    ),
    Doctor(
        id="kavya-rao",
        name="Dr. Kavya Rao",
        title="MBBS, MD (Dermatology)",
        specialities=("skin", "hair"),
        location="Bengaluru",
        languages=("English", "Kannada", "Telugu"),
        experience_years=7,
        photo_url=_photo("women", 57),
        bio=(
            "Kavya focuses on adult acne, pigmentation and hair thinning. She is candid about "
            "how long results actually take, which patients tend to appreciate afterwards."
        ),
        consultation_fee=600,
        rating=4.6,
        review_count=198,
        available_days=("Tue", "Thu", "Sat"),
    ),
    Doctor(
        id="imran-sheikh",
        name="Dr. Imran Sheikh",
        title="MBBS, MD (Pulmonology)",
        specialities=("respiratory",),
        location="Hyderabad",
        languages=("English", "Hindi", "Urdu", "Telugu"),
        experience_years=15,
        photo_url=_photo("men", 19),
        bio=(
            "Imran manages asthma, COPD and the long tail of post-viral breathlessness. He "
            "spends more of each consultation on inhaler technique than most patients expect, "
            "and it tends to be the thing that helps."
        ),
        consultation_fee=800,
        rating=4.7,
        review_count=331,
        available_days=("Mon", "Tue", "Thu", "Fri"),
    ),
    Doctor(
        id="deepa-subramanian",
        name="Dr. Deepa Subramanian",
        title="MBBS, MD (Psychiatry)",
        specialities=("mental-health",),
        location="Online only",
        languages=("English", "Tamil", "Hindi"),
        experience_years=13,
        photo_url=_photo("women", 90),
        bio=(
            "Deepa consults entirely online, which she found removes a real barrier for people "
            "who would not walk into a psychiatry clinic. She works mainly with anxiety, "
            "depression and burnout."
        ),
        consultation_fee=1100,
        rating=4.9,
        review_count=467,
        available_days=("Mon", "Tue", "Wed", "Thu", "Fri"),
    ),
    Doctor(
        id="nikhil-verma",
        name="Dr. Nikhil Verma",
        title="MBBS, DM (Gastroenterology)",
        specialities=("digestive", "liver"),
        location="Delhi",
        languages=("English", "Hindi"),
        experience_years=16,
        photo_url=_photo("men", 64),
        bio=(
            "Nikhil sees a great deal of IBS and reflux that has been treated as trivial "
            "elsewhere. He investigates properly before settling on a long-term plan."
        ),
        consultation_fee=1000,
        rating=4.6,
        review_count=389,
        available_days=("Wed", "Thu", "Fri", "Sat"),
    ),
    Doctor(
        id="lakshmi-pillai",
        name="Dr. Lakshmi Pillai",
        title="MBBS, MD (Endocrinology)",
        specialities=("thyroid", "diabetes", "reproductive"),
        location="Kochi",
        languages=("English", "Malayalam", "Tamil"),
        experience_years=19,
        photo_url=_photo("women", 33),
        bio=(
            "Lakshmi works at the overlap of hormonal conditions — thyroid disease, PCOS and "
            "diabetes frequently travelling together. She is a useful second opinion when a "
            "diagnosis has not quite added up."
        ),
        consultation_fee=1100,
        rating=4.8,
        review_count=522,
        available_days=("Mon", "Wed", "Fri"),
    ),
    Doctor(
        id="rohan-mehta",
        name="Dr. Rohan Mehta",
        title="MBBS, DM (Nephrology)",
        specialities=("kidney",),
        location="Mumbai",
        languages=("English", "Hindi", "Gujarati"),
        experience_years=10,
        photo_url=_photo("men", 8),
        bio=(
            "Rohan manages chronic kidney disease and dialysis planning. He is straightforward "
            "about prognosis, which patients making long-term decisions tend to want."
        ),
        consultation_fee=950,
        rating=4.5,
        review_count=214,
        available_days=("Tue", "Thu", "Sat"),
    ),
    Doctor(
        id="aisha-khan",
        name="Dr. Aisha Khan",
        title="MBBS, MS (Obstetrics & Gynaecology)",
        specialities=("reproductive", "thyroid"),
        location="Pune",
        languages=("English", "Hindi", "Urdu", "Marathi"),
        experience_years=8,
        photo_url=_photo("women", 79),
        bio=(
            "Aisha covers antenatal care and menstrual disorders, and routinely checks thyroid "
            "function because so much of what she sees turns out to be linked to it."
        ),
        consultation_fee=750,
        rating=4.7,
        review_count=273,
        available_days=("Mon", "Tue", "Thu"),
    ),
    Doctor(
        id="suresh-babu",
        name="Dr. Suresh Babu",
        title="MBBS, MD (General Medicine)",
        specialities=("diabetes", "heart", "kidney"),
        location="Chennai",
        languages=("English", "Tamil", "Telugu"),
        experience_years=25,
        photo_url=_photo("men", 40),
        bio=(
            "Suresh has run a general practice for twenty-five years and knows the pattern of "
            "long-standing diabetes turning into cardiac and kidney problems. Much of his work "
            "is catching that early."
        ),
        consultation_fee=700,
        rating=4.8,
        review_count=926,
        available_days=("Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
    ),
    Doctor(
        id="ananya-ghosh",
        name="Dr. Ananya Ghosh",
        title="MBBS, MD (Psychiatry)",
        specialities=("mental-health",),
        location="Bengaluru",
        languages=("English", "Bengali", "Hindi"),
        experience_years=6,
        photo_url=_photo("women", 5),
        bio=(
            "Ananya works largely with younger adults on anxiety, ADHD assessment and sleep. "
            "She favours therapy alongside medication rather than either on its own."
        ),
        consultation_fee=900,
        rating=4.7,
        review_count=156,
        available_days=("Wed", "Thu", "Fri", "Sat"),
    ),
    Doctor(
        id="karthik-raman",
        name="Dr. Karthik Raman",
        title="MBBS, MS (Orthopaedics)",
        specialities=("joints",),
        location="Online only",
        languages=("English", "Tamil", "Kannada"),
        experience_years=12,
        photo_url=_photo("men", 94),
        bio=(
            "Karthik consults online for second opinions on knee and spine surgery "
            "recommendations. A good share of his advice is that the operation can reasonably "
            "wait."
        ),
        consultation_fee=1000,
        rating=4.6,
        review_count=203,
        available_days=("Tue", "Wed", "Fri"),
    ),
)


class DoctorRepository:
    def list_all(self) -> list[Doctor]:
        return list(_DOCTORS)

    def get_by_id(self, doctor_id: str) -> Doctor | None:
        return next((doctor for doctor in _DOCTORS if doctor.id == doctor_id), None)
