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

```text
1) sigue andando mal el tema del Equipo Ganador HCP (no calcula bien o no refresca, no me queda claro que es lo que hace que calcula mal en distintas oportunidades, me parece que es mas cuando el ganador por handicap es distinto del ganador abierto y es el segundo equipo (el de la derecha).

2) en el reporte de resultado Partidos: si podes agregarle otro filtro por torneo (esta por temporada y torneo).

3) en el reporte de "Resultado partidos", me podras agregar un filtro por equipo ? que me muestre para esa temporada y categoría por equipo (ya sea del lado del equipo 1 o equipo 2).
```
