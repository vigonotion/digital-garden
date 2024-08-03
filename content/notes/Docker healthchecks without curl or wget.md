---
tags:
  - docker
  - docker-compose
  - curl
  - wget
date: 2024-04-24
---
I needed to add healthchecks to a container that does not have `curl` and `wget` installed.

I found this snippet which uses raw tcp sockets and should work everywhere:

```bash
healthcheck:
	test: [ "CMD-SHELL", "exec 3<>/dev/tcp/127.0.0.1/8080;echo -e \"GET /health HTTP/1.1\r\nhost: http://localhost\r\nConnection: close\r\n\r\n\" >&3;grep \"HTTP/1.1 200 OK\" <&3" ]
	interval: 10s
	timeout: 5s
	retries: 5
```

This loosely translates to this curl command:

```bash
curl -f http://localhost:8080/health || exit 1
```

Source: https://stackoverflow.com/a/76790330