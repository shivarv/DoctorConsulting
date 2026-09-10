-- DoctorConsulting — reference data.
--
--     psql -d doctorconsulting -f db/seed_doctors.sql
--
-- Generated from src/core/conditions.py and
-- src/repositories/doctor_repository.py, which are the current source of
-- truth. Re-running is safe: every row upserts, so edits here overwrite
-- rather than collide.

BEGIN;

-- Conditions -------------------------------------------------------------

INSERT INTO conditions (slug, label) VALUES
    ('diabetes', 'Diabetes'),
    ('thyroid', 'Thyroid'),
    ('skin', 'Skin'),
    ('hair', 'Hair'),
    ('liver', 'Liver'),
    ('kidney', 'Kidney'),
    ('reproductive', 'Reproductive Health'),
    ('heart', 'Heart'),
    ('digestive', 'Digestive'),
    ('joints', 'Joints & Bones'),
    ('respiratory', 'Respiratory'),
    ('mental-health', 'Mental Health')
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label;

-- Doctors ----------------------------------------------------------------

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'anjali-menon',
    'Dr. Anjali Menon',
    'MBBS, MD (Endocrinology)',
    'Chennai',
    'Anjali has spent most of her career helping people bring type 2 diabetes under control without upending their lives. She works in small, sustainable changes rather than sweeping restrictions, and sees a lot of thyroid alongside it.',
    'https://randomuser.me/api/portraits/women/44.jpg',
    14, 800,
    ARRAY['English', 'Tamil', 'Malayalam'],
    ARRAY['Mon', 'Tue', 'Thu', 'Fri'],
    4.8, 412
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'rahul-iyer',
    'Dr. Rahul Iyer',
    'MBBS, MD (Dermatology)',
    'Bengaluru',
    'Rahul treats chronic skin conditions — eczema, psoriasis, stubborn acne — and pattern hair loss. He is careful about what actually has evidence behind it and will say so when a treatment does not.',
    'https://randomuser.me/api/portraits/men/32.jpg',
    11, 700,
    ARRAY['English', 'Kannada', 'Hindi'],
    ARRAY['Mon', 'Wed', 'Fri', 'Sat'],
    4.6, 289
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'priya-nair',
    'Dr. Priya Nair',
    'MBBS, DM (Nephrology)',
    'Kochi',
    'Priya specialises in slowing the progression of chronic kidney disease, most often in patients who also live with diabetes. She spends real time on diet and medication review before considering anything more invasive.',
    'https://randomuser.me/api/portraits/women/68.jpg',
    17, 1000,
    ARRAY['English', 'Malayalam'],
    ARRAY['Tue', 'Wed', 'Thu'],
    4.9, 534
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'vikram-desai',
    'Dr. Vikram Desai',
    'MBBS, DM (Hepatology)',
    'Mumbai',
    'Vikram sees fatty liver disease more than anything else, and is direct about the fact that most of it is reversible. He also manages hepatitis and long-running digestive complaints that have not responded to first-line treatment.',
    'https://randomuser.me/api/portraits/men/75.jpg',
    20, 1200,
    ARRAY['English', 'Hindi', 'Marathi', 'Gujarati'],
    ARRAY['Mon', 'Thu', 'Fri'],
    4.7, 618
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'sneha-reddy',
    'Dr. Sneha Reddy',
    'MBBS, MS (Obstetrics & Gynaecology)',
    'Hyderabad',
    'Sneha works in fertility and PCOS management, and is used to patients arriving after several inconclusive opinions. She is unhurried in consultations and explains what each test is actually for.',
    'https://randomuser.me/api/portraits/women/12.jpg',
    9, 900,
    ARRAY['English', 'Telugu', 'Hindi'],
    ARRAY['Mon', 'Tue', 'Wed', 'Sat'],
    4.8, 347
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'arjun-kapoor',
    'Dr. Arjun Kapoor',
    'MBBS, DM (Cardiology)',
    'Delhi',
    'Arjun handles everything from a first raised blood pressure reading to post-infarction follow-up. His view is that most cardiac risk is managed years before it becomes cardiac treatment.',
    'https://randomuser.me/api/portraits/men/51.jpg',
    22, 1500,
    ARRAY['English', 'Hindi', 'Punjabi'],
    ARRAY['Tue', 'Thu', 'Sat'],
    4.9, 871
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'meera-krishnan',
    'Dr. Meera Krishnan',
    'MBBS, MD (General Medicine)',
    'Chennai',
    'Meera is a generalist by choice — most of her patients arrive with two or three overlapping conditions rather than one clean problem, and she prefers managing the whole picture over splitting it across specialists.',
    'https://randomuser.me/api/portraits/women/23.jpg',
    12, 650,
    ARRAY['English', 'Tamil'],
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    4.7, 402
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'sanjay-gupta',
    'Dr. Sanjay Gupta',
    'MBBS, MS (Orthopaedics)',
    'Pune',
    'Sanjay treats osteoarthritis, frozen shoulder and sports injuries, with a strong bias toward physiotherapy and load management before surgery is discussed.',
    'https://randomuser.me/api/portraits/men/86.jpg',
    18, 850,
    ARRAY['English', 'Hindi', 'Marathi'],
    ARRAY['Mon', 'Wed', 'Fri'],
    4.5, 256
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'kavya-rao',
    'Dr. Kavya Rao',
    'MBBS, MD (Dermatology)',
    'Bengaluru',
    'Kavya focuses on adult acne, pigmentation and hair thinning. She is candid about how long results actually take, which patients tend to appreciate afterwards.',
    'https://randomuser.me/api/portraits/women/57.jpg',
    7, 600,
    ARRAY['English', 'Kannada', 'Telugu'],
    ARRAY['Tue', 'Thu', 'Sat'],
    4.6, 198
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'imran-sheikh',
    'Dr. Imran Sheikh',
    'MBBS, MD (Pulmonology)',
    'Hyderabad',
    'Imran manages asthma, COPD and the long tail of post-viral breathlessness. He spends more of each consultation on inhaler technique than most patients expect, and it tends to be the thing that helps.',
    'https://randomuser.me/api/portraits/men/19.jpg',
    15, 800,
    ARRAY['English', 'Hindi', 'Urdu', 'Telugu'],
    ARRAY['Mon', 'Tue', 'Thu', 'Fri'],
    4.7, 331
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'deepa-subramanian',
    'Dr. Deepa Subramanian',
    'MBBS, MD (Psychiatry)',
    'Online only',
    'Deepa consults entirely online, which she found removes a real barrier for people who would not walk into a psychiatry clinic. She works mainly with anxiety, depression and burnout.',
    'https://randomuser.me/api/portraits/women/90.jpg',
    13, 1100,
    ARRAY['English', 'Tamil', 'Hindi'],
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    4.9, 467
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'nikhil-verma',
    'Dr. Nikhil Verma',
    'MBBS, DM (Gastroenterology)',
    'Delhi',
    'Nikhil sees a great deal of IBS and reflux that has been treated as trivial elsewhere. He investigates properly before settling on a long-term plan.',
    'https://randomuser.me/api/portraits/men/64.jpg',
    16, 1000,
    ARRAY['English', 'Hindi'],
    ARRAY['Wed', 'Thu', 'Fri', 'Sat'],
    4.6, 389
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'lakshmi-pillai',
    'Dr. Lakshmi Pillai',
    'MBBS, MD (Endocrinology)',
    'Kochi',
    'Lakshmi works at the overlap of hormonal conditions — thyroid disease, PCOS and diabetes frequently travelling together. She is a useful second opinion when a diagnosis has not quite added up.',
    'https://randomuser.me/api/portraits/women/33.jpg',
    19, 1100,
    ARRAY['English', 'Malayalam', 'Tamil'],
    ARRAY['Mon', 'Wed', 'Fri'],
    4.8, 522
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'rohan-mehta',
    'Dr. Rohan Mehta',
    'MBBS, DM (Nephrology)',
    'Mumbai',
    'Rohan manages chronic kidney disease and dialysis planning. He is straightforward about prognosis, which patients making long-term decisions tend to want.',
    'https://randomuser.me/api/portraits/men/8.jpg',
    10, 950,
    ARRAY['English', 'Hindi', 'Gujarati'],
    ARRAY['Tue', 'Thu', 'Sat'],
    4.5, 214
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'aisha-khan',
    'Dr. Aisha Khan',
    'MBBS, MS (Obstetrics & Gynaecology)',
    'Pune',
    'Aisha covers antenatal care and menstrual disorders, and routinely checks thyroid function because so much of what she sees turns out to be linked to it.',
    'https://randomuser.me/api/portraits/women/79.jpg',
    8, 750,
    ARRAY['English', 'Hindi', 'Urdu', 'Marathi'],
    ARRAY['Mon', 'Tue', 'Thu'],
    4.7, 273
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'suresh-babu',
    'Dr. Suresh Babu',
    'MBBS, MD (General Medicine)',
    'Chennai',
    'Suresh has run a general practice for twenty-five years and knows the pattern of long-standing diabetes turning into cardiac and kidney problems. Much of his work is catching that early.',
    'https://randomuser.me/api/portraits/men/40.jpg',
    25, 700,
    ARRAY['English', 'Tamil', 'Telugu'],
    ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    4.8, 926
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'ananya-ghosh',
    'Dr. Ananya Ghosh',
    'MBBS, MD (Psychiatry)',
    'Bengaluru',
    'Ananya works largely with younger adults on anxiety, ADHD assessment and sleep. She favours therapy alongside medication rather than either on its own.',
    'https://randomuser.me/api/portraits/women/5.jpg',
    6, 900,
    ARRAY['English', 'Bengali', 'Hindi'],
    ARRAY['Wed', 'Thu', 'Fri', 'Sat'],
    4.7, 156
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

INSERT INTO doctors (
    id, name, title, location, bio, photo_url,
    experience_years, consultation_fee, languages, available_days,
    rating, review_count
) VALUES (
    'karthik-raman',
    'Dr. Karthik Raman',
    'MBBS, MS (Orthopaedics)',
    'Online only',
    'Karthik consults online for second opinions on knee and spine surgery recommendations. A good share of his advice is that the operation can reasonably wait.',
    'https://randomuser.me/api/portraits/men/94.jpg',
    12, 1000,
    ARRAY['English', 'Tamil', 'Kannada'],
    ARRAY['Tue', 'Wed', 'Fri'],
    4.6, 203
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    experience_years = EXCLUDED.experience_years,
    consultation_fee = EXCLUDED.consultation_fee,
    languages = EXCLUDED.languages,
    available_days = EXCLUDED.available_days,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count;

-- Specialities -----------------------------------------------------------
-- Rebuilt wholesale rather than merged, so a speciality removed above is
-- actually removed here.

DELETE FROM doctor_conditions;

INSERT INTO doctor_conditions (doctor_id, condition_slug) VALUES
    ('anjali-menon', 'diabetes'),
    ('anjali-menon', 'thyroid'),
    ('rahul-iyer', 'skin'),
    ('rahul-iyer', 'hair'),
    ('priya-nair', 'kidney'),
    ('priya-nair', 'diabetes'),
    ('vikram-desai', 'liver'),
    ('vikram-desai', 'digestive'),
    ('sneha-reddy', 'reproductive'),
    ('arjun-kapoor', 'heart'),
    ('meera-krishnan', 'diabetes'),
    ('meera-krishnan', 'thyroid'),
    ('meera-krishnan', 'heart'),
    ('sanjay-gupta', 'joints'),
    ('kavya-rao', 'skin'),
    ('kavya-rao', 'hair'),
    ('imran-sheikh', 'respiratory'),
    ('deepa-subramanian', 'mental-health'),
    ('nikhil-verma', 'digestive'),
    ('nikhil-verma', 'liver'),
    ('lakshmi-pillai', 'thyroid'),
    ('lakshmi-pillai', 'diabetes'),
    ('lakshmi-pillai', 'reproductive'),
    ('rohan-mehta', 'kidney'),
    ('aisha-khan', 'reproductive'),
    ('aisha-khan', 'thyroid'),
    ('suresh-babu', 'diabetes'),
    ('suresh-babu', 'heart'),
    ('suresh-babu', 'kidney'),
    ('ananya-ghosh', 'mental-health'),
    ('karthik-raman', 'joints')
ON CONFLICT DO NOTHING;

COMMIT;
