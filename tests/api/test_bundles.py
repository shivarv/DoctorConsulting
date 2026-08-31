from fastapi.testclient import TestClient

from tests.conftest import MakeBundle


def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_bundles_returns_summaries_with_counts(
    client: TestClient, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-warm-up.mp4", "02-standing-flow.mp4")
    make_bundle("deep-stretch")

    response = client.get("/api/bundles")

    assert response.status_code == 200
    assert response.json() == [
        {
            "slug": "deep-stretch",
            "title": "Deep Stretch & Wind Down",
            "description": "Long, quiet holds to close out the day.",
            "level": "beginner",
            "thumbnail": None,
            "video_count": 0,
        },
        {
            "slug": "morning-flow",
            "title": "Morning Flow",
            "description": "Wake the body up with a gentle standing sequence.",
            "level": "beginner",
            "thumbnail": None,
            "video_count": 2,
        },
    ]


def test_list_bundles_is_empty_without_any_folders(client: TestClient) -> None:
    response = client.get("/api/bundles")

    assert response.status_code == 200
    assert response.json() == []


def test_get_bundle_returns_detail_with_videos(
    client: TestClient, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-sun-salutation.mp4", "cover.jpg")

    response = client.get("/api/bundles/morning-flow")

    assert response.status_code == 200
    assert response.json() == {
        "slug": "morning-flow",
        "title": "Morning Flow",
        "description": "Wake the body up with a gentle standing sequence.",
        "level": "beginner",
        "thumbnail": "/videos/morning-flow/cover.jpg",
        "video_count": 1,
        "videos": [
            {
                "id": "morning-flow/01-sun-salutation.mp4",
                "title": "Sun Salutation",
                "file": "/videos/morning-flow/01-sun-salutation.mp4",
                "order": 1,
            }
        ],
    }


def test_get_bundle_404_for_unknown_slug(
    client: TestClient, make_bundle: MakeBundle
) -> None:
    make_bundle("morning-flow", "01-warm-up.mp4")

    response = client.get("/api/bundles/does-not-exist")

    assert response.status_code == 404


def test_malformed_slugs_are_rejected_before_the_filesystem(client: TestClient) -> None:
    for slug in ("Morning-Flow", "morning flow", "-morning", "morning..flow", "%2E%2E"):
        response = client.get(f"/api/bundles/{slug}")
        assert response.status_code == 422, (slug, response.status_code)


def test_encoded_traversal_never_returns_a_file(client: TestClient) -> None:
    response = client.get("/api/bundles/..%2F..%2Fetc")

    assert response.status_code in {404, 422}
