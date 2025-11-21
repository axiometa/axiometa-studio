FROM python:3.10-slim

RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY install-arduino-cli.sh .
RUN chmod +x install-arduino-cli.sh && ./install-arduino-cli.sh && \
    apt-get purge -y git && apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* /root/.cache

ENV PATH="/app/.arduino/bin:${PATH}"
ENV ARDUINO_DATA_DIR="/app/.arduino/data"

COPY main.py .
RUN mkdir -p /app/builds

EXPOSE 8000
CMD ["python", "main.py"]
