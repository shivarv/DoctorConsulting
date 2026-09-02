"""The canonical set of conditions a doctor can treat.

Slugs are the stable identifier used in doctor records and URL filters; labels
are display-only. Doctors reference conditions by slug so a rename is a
one-line change here rather than a sweep through the data.
"""

CONDITIONS: dict[str, str] = {
    "diabetes": "Diabetes",
    "thyroid": "Thyroid",
    "skin": "Skin",
    "hair": "Hair",
    "liver": "Liver",
    "kidney": "Kidney",
    "reproductive": "Reproductive Health",
    "heart": "Heart",
    "digestive": "Digestive",
    "joints": "Joints & Bones",
    "respiratory": "Respiratory",
    "mental-health": "Mental Health",
}


def label_for(slug: str) -> str:
    return CONDITIONS[slug]
