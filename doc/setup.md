1. install rvm
2. clone repo locally
3. cd app/ && bundle install
4. create config/push_server.yml with content
```
    host: localhost
    port: 8082
```
5. run rails server
```
    rails s
```

6. run push server
    cd push_server && node server

7. configure nginx
    upstream application {
      server 127.0.0.1:3000 max_fails=0 fail_timeout=20s;
    }

    upstream push_server {
      server 127.0.0.1:3333 max_fails=0 fail_timeout=20s;
    }

    server {
      listen 80;

      client_max_body_size 4G;
      root /path/to/app/demo_app;

      location @unicorn {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        include blocked.conf;

        proxy_pass http://application;
      }

      location ~ ^/broadcast? {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
        chunked_transfer_encoding off;
        proxy_set_header Connection keep-alive;
        proxy_buffering off;
        proxy_send_timeout 600s;

        proxy_pass http://push_server;
      }

      try_files /public/$uri @unicorn;

      error_page 500 502 503 504 /500.html;

    }

8. run application in browser by http://localhost/

