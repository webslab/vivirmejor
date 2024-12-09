# FROM denoland/deno:distroless-2.0.2 AS build
#
# COPY . /app
#
# WORKDIR /app
# RUN deno install
# RUN deno task build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /var/www/html
COPY /dist /var/www/html
