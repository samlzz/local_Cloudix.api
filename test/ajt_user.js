//? ajoute l'utilisateurs du fichier "utilitest" a la base de données

const utilitest = require('./test/utilitest');
app.use('', (req, res, next) => {
  const utili = new User({
    ...utilitest
  });
  utili.save()
  console.log('enregistré')
});


//const number = 10;
//console.log(number ? typeof number == int : )