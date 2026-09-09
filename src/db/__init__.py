"""Postgres connections.

The only module in the project that knows psycopg exists. Repositories borrow
a connection from the pool here; nothing above them ever sees one.

A pool rather than a connection per request: opening a TCP socket and running
the SCRAM password handshake costs tens of milliseconds, which would dominate
the response time of queries that take under one.
"""

from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from src.core import config

_pool: ConnectionPool | None = None


class DatabaseNotConfiguredError(RuntimeError):
    def __init__(self) -> None:
        super().__init__(
            "DATABASE_URL is not set. Copy .env.example to .env and fill it in "
            "— see db/README.md."
        )


def get_pool() -> ConnectionPool:
    """The process-wide pool, opened on first use.

    Built lazily rather than at import so that importing the app — which the
    tests and any tooling do — never requires a reachable database.
    """
    global _pool

    if _pool is None:
        if not config.DATABASE_URL:
            raise DatabaseNotConfiguredError

        _pool = ConnectionPool(
            config.DATABASE_URL,
            min_size=1,
            max_size=10,
            # Rows arrive as dicts, so queries are read by column name and a
            # SELECT can gain a column without shifting every index.
            kwargs={"row_factory": dict_row},
            open=True,
        )

    return _pool


def close_pool() -> None:
    """Release every connection. Called on application shutdown."""
    global _pool

    if _pool is not None:
        _pool.close()
        _pool = None
