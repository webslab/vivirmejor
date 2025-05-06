# FROM denoland/deno AS build
#
# COPY . /app
#
# WORKDIR /app
# RUN deno install --no-lock --node-modules-dir=auto --allow-scripts=npm:sharp,npm:parcel,npm:@parcel/watcher
# RUN deno task build

FROM nginx:alpine-otel

# nginx config
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY deploy/nginx.variables.conf /etc/nginx/templates/10-variables.conf.template

# web app
# COPY --from=build /app/dist /var/www/html
COPY /dist /var/www/html
