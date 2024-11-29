# FROM denoland/deno:distroless-2.0.2 AS build
#
# COPY . /app
#
# WORKDIR /app
# RUN deno install
# RUN deno task build

FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html
COPY /dist /usr/share/nginx/html
