#!/usr/bin/env bash

echo "Restauration des projets dans Backend/database.sqlite..."

DATABASE="Backend/database.sqlite"
BACKUP="Backend/database.backup.sqlite"

if [ ! -f "$BACKUP" ]; then
  echo "Erreur : la sauvegarde $BACKUP est introuvable."
  echo "Cree-la avec : cp Backend/database.sqlite Backend/database.backup.sqlite"
  exit 1
fi

cp "$BACKUP" "$DATABASE"

if [ $? -eq 0 ]; then
  echo "Base de donnees restauree avec succes depuis $BACKUP."
  exit 0
fi

echo ""
echo "La restauration a echoue."
echo "Si tu vois une erreur du type 'unable to unlink old Backend/database.sqlite',"
echo "arrete le backend avec Ctrl + C dans le terminal ou npm start tourne,"
echo "puis relance ce script."

exit 1
