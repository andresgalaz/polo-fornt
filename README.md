# App Polo Handicap Frontend

## Compilar y Arrancar

```bash
git pull orign master
yarn install
yarn build
# Ver si el puerto 4000 está disponible
serve -s build -p 4000 > serve.log 2>&1 &
```

### Ver pots utilizados

```bash
sudo lsof -i -P -n | grep LISTEN
sudo ss -tulpn | grep LISTEN
```
