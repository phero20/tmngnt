FROM nginx:alpine
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf.template

CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL} ${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && cat /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
