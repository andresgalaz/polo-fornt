# App Polo Handicap Frontend

## Compilar y Arrancar

```bash
git pull orign master
yarn install
yarn build
# Ver si el puerto 4000 está disponible
serve -s build -p 4000 > serve.log 2>&1 &
```

### Ver procesos y ports utilizados

```bash
sudo lsof -i -P -n | grep LISTEN
sudo ss -tulpn | grep LISTEN
# Una vez detectado en numero de proceso
ps -f '<pid>'
```

por ejemplo:

```bash
ps -f 128887
UID          PID    PPID  C STIME TTY      STAT   TIME CMD
admin     128887       1  0 Apr18 ?        Sl     0:09 node /usr/local/bin/serve -s build -p 4000

kill -1 128887
```
