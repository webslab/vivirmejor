# FROM denoland/deno:alpine AS build
#
# COPY . /app
#
# WORKDIR /app
# RUN deno install --allow-scripts=npm:sharp,npm:parcel,npm:@parcel/watcher
# RUN deno task build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /var/www/html
COPY /dist /var/www/html
