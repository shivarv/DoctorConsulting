from fastapi.testclient import TestClient


def test_list_doctors_returns_summaries(client: TestClient) -> None:
    response = client.get("/api/doctors")

    assert response.status_code == 200
    doctors = response.json()
    assert len(doctors) >= 10
    assert set(doctors[0]) == {
        "id",
        "name",
        "title",
        "specialities",
        "location",
        "experience_years",
        "photo_url",
        "consultation_fee",
        "rating",
        "review_count",
    }


def test_specialities_are_expanded_to_slug_and_label(client: TestClient) -> None:
    response = client.get("/api/doctors/anjali-menon")

    assert response.status_code == 200
    assert response.json()["specialities"] == [
        {"slug": "diabetes", "label": "Diabetes"},
        {"slug": "thyroid", "label": "Thyroid"},
    ]


def test_detail_adds_bio_languages_and_availability(client: TestClient) -> None:
    response = client.get("/api/doctors/anjali-menon")

    body = response.json()
    assert body["name"] == "Dr. Anjali Menon"
    assert body["bio"]
    assert "Tamil" in body["languages"]
    assert body["available_days"]


def test_unknown_doctor_is_404(client: TestClient) -> None:
    assert client.get("/api/doctors/no-such-doctor").status_code == 404


def test_malformed_doctor_ids_are_rejected(client: TestClient) -> None:
    for doctor_id in ("Anjali-Menon", "anjali menon", "-anjali"):
        response = client.get(f"/api/doctors/{doctor_id}")
        assert response.status_code == 422, (doctor_id, response.status_code)


def test_availability_response_shape(client: TestClient) -> None:
    response = client.get("/api/doctors/anjali-menon/availability")

    assert response.status_code == 200
    body = response.json()
    assert body["doctor_id"] == "anjali-menon"
    assert body["days"]

    day = body["days"][0]
    assert set(day) == {"date", "weekday", "slots"}
    assert day["weekday"] in {"Mon", "Tue", "Thu", "Fri"}
    assert set(day["slots"][0]) == {"time", "available"}


def test_availability_404_for_unknown_doctor(client: TestClient) -> None:
    assert client.get("/api/doctors/no-such-doctor/availability").status_code == 404


def test_availability_422_for_malformed_id(client: TestClient) -> None:
    assert client.get("/api/doctors/Anjali_Menon/availability").status_code == 422
