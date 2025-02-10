# FROM denoland/deno AS build
#
# COPY . /app
#
# WORKDIR /app
# RUN deno install --no-lock --node-modules-dir=auto --allow-scripts=npm:sharp,npm:parcel,npm:@parcel/watcher
# RUN deno task build

FROM nginx:alpine

# nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.env.template /etc/nginx/templates/10-variables.conf.template

# web app
# COPY --from=build /app/dist /var/www/html
COPY /dist /var/www/html
