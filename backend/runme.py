import os
import uvicorn
from apps.base.hello import hello, logger
from apps.base.conf import conf, LogLevel
from apps.route import create_app

app = create_app()

if __name__ == "__main__":
    try:
        hello()
        # Render sẽ cung cấp PORT environment variable
        port = int(os.environ.get("PORT", 8089))
        uvicorn.run(
            app='runme:app',
            host='0.0.0.0',  # Quan trọng: phải là 0.0.0.0
            port=port,
            reload=False,  # Tắt reload trong production
            log_level=LogLevel.lower(),
        )
    except Exception as e:
        logger.exception("Service Exception!", e)