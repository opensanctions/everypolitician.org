
docker-build:
	docker build -t site --secret id=api_token,env=API_TOKEN --progress=plain .
