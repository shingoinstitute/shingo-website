var express = require('express');
var router = express.Router();

/******* Recipients Route *********/
// All .pdf files are served statically and can be found at /public/assets/press

/* GET awards  */
/** @type {{ [name: string]: { path: string, title?: string }}} */
const routes =
{
    '': { path: 'awards/awards' }
    /********** Shingo Prize Recipients *********/
    , 'prize-ball-bev-cans': { path: 'awards/prize-shingo/prize-ball-bev-cans' }
    , 'prize-abbvie': { path: 'awards/prize-shingo/prize-abbvie' }
    , 'prize-abbott-nutrition': { path: 'awards/prize-shingo/prize-abbott-nutrition' }
    /* Boston Prize Profile */
    , 'prize-thermo-fisher': { path: 'awards/prize-shingo/prize-thermo-fisher' }
    , 'prize-thermo-fisher-pr': { path: 'awards/prize-shingo/prize-thermo-fisher-pr' }
    , 'prize-ball-bev': { path: 'awards/prize-shingo/prize-ball-bev' }
    , 'prize-ball-bev-pr': { path: 'awards/prize-shingo/prize-ball-bev-pr' }

    /* Boston Prize Profile */
    , 'prize-boston': { path: 'awards/prize-shingo/prize-boston' }
    , 'prize-boston-pr': { path: 'awards/prize-shingo/prize-boston-pr' }

    /* Rexam Prize Profile */
    , 'prize-rexam-bev': { path: 'awards/prize-shingo/prize-rexam-bev' }

    /* Abbot Prize Profile */
    , 'prize-abbott': { path: 'awards/prize-shingo/prize-abbott' }

    /* ECA Prize Profile */
    , 'prize-eca': { path: 'awards/prize-shingo/prize-eca' }

    /* NewsPrinters Prize Profile */
    , 'prize-newsprinters': { path: 'awards/prize-shingo/prize-newsprinters' }

    /* Barnes Prize Profile */
    , 'prize-barnes-ogden': { path: 'awards/prize-shingo/prize-barnes-ogden' }

    /* Depuy Prize Profile */
    , 'prize-depuysynthes-ireland': { path: 'awards/prize-shingo/prize-depuysynthes-ireland' }

    /* Abbott Vascular Prize Profile */
    , 'prize-abbottvascular-ireland': { path: 'awards/prize-shingo/prize-abbottvascular' }

    /* Ethicon Prize Profile */
    , 'prize-ethicon': { path: 'awards/prize-shingo/prize-ethicon' }

    /* Aguas Claras Prize Profile */
    , 'prize-rexam': { path: 'awards/prize-shingo/prize-rexam' }

    /* Goodyear Brasil Prize Profile */
    , 'prize-goodyear-brasil': { path: 'awards/prize-shingo/prize-goodyear-brasil' }


    /******* Silver Recipients *********/

    , 'silver-massmutual': { path: 'awards/prize-silver/silver-massmutual' }

    , 'silver-bridgestoneBATO': { path: 'awards/prize-silver/silver-bridgestoneBATO' }

    , 'silver-bridgestoneBATO-pr': { path: 'awards/prize-silver/silver-bridgestoneBATO-pr' }
    , 'silver-ballbeverage': { path: 'awards/prize-silver/silver-ballbeverage' }

    , 'silver-ballbeverage-pr': { path: 'awards/prize-silver/silver-ballbeverage-pr' }

    , 'silver-visteon': { path: 'awards/prize-silver/silver-visteon' }

    , 'silver-visteon-pr': { path: 'awards/prize-silver/silver-visteon-pr' }

    , 'silver-hospira': { path: 'awards/prize-silver/silver-hospira' }

    , 'silver-hospira-pr': { path: 'awards/prize-silver/silver-hospira-pr' }

    /* Mettarottapharm Profile */
    , 'silver-medarottapharm': { path: 'awards/prize-silver/silver-medarottapharm' }

    , 'silver-medarottapharm-pr': { path: 'awards/prize-silver/silver-medarottapharm-pr' }

    /* GET commonwealth */
    , 'silver_commonwealth': { path: 'awards/prize-silver/silver-commonwealth' }

    /* GET rexam */
    , 'silver_rexam-jacarei': { path: 'awards/prize-silver/silver-rexam-jacarei' }

    /* GET rexam */
    , 'silver_pympsa': { path: 'awards/prize-silver/silver-pympsa' }


    /******** Bronze Recipients ********/

    , 'bronze-forest-tosara': { path: 'awards/prize-bronze/bronze-forest-tosara' }

    , 'bronze-cardinalhealth': { path: 'awards/prize-bronze/bronze-cardinalhealth' }

    , 'bronze-cardinalhealth-pr': { path: 'awards/prize-bronze/bronze-cardinalhealth-pr' }

    , 'bronze-ipsenbio': { path: 'awards/prize-bronze/bronze-ipsenbio' }

    , 'bronze-ipsenbio-pr': { path: 'awards/prize-bronze/bronze-ipsenbio-pr' }

    , 'bronze-letterkenny': { path: 'awards/prize-bronze/bronze-letterkenny' }

    , 'bronze-letterkenny-pr': { path: 'awards/prize-bronze/bronze-letterkenny-pr' }

    , 'bronze-landapparel': { path: 'awards/prize-bronze/bronze-landapparel' }

    , 'bronze-landapparel-pr': { path: 'awards/prize-bronze/bronze-landapparel-pr' }

    /* GET rexam */
    , 'bronze_lake': { path: 'awards/prize-bronze/bronze-lake' }

    /* GET lundbeck*/
    , 'bronze_lundbeck-italy': { path: 'awards/prize-bronze/bronze-lundbeck-italy' }

    /* GET vistaprint*/
    , 'bronze_vistaprint-australia': { path: 'awards/prize-bronze/bronze-vistaprint-australia' }

    /******* Research Recipients *********/
    , 'publication-toyota-way-liker': { path: 'awards/prize-publication/publication-toyota-way-liker' }

    /******* Research Recipients *********/
    /* GET card-system */
    , 'publication-matthias-thur': { path: 'awards/prize-publication/publication-matthias-thur' }

    /* GET lean farm */
    , 'publication-jan-compton': { path: 'awards/prize-research/publication-jan-compton' }

    /* GET lean farm */
    , 'research-paul-aker': { path: 'awards/prize-research/research-paul-aker' }

    /* GET lean farm */
    , 'research-ben-hartman': { path: 'awards/prize-research/research-ben-hartman' }

    /* GET management on the mend */
    , 'research-john-toussaint': { path: 'awards/prize-research/research-john-toussaint' }

    /* GET lean-driven */
    , 'research-norbert-majerus': { path: 'awards/prize-research/research-norbert-majerus' }

    /* GET lean long term */
    , 'research-baker-rolfes': { path: 'awards/prize-research/research-baker-rolfes' }

    /* GET fit org */
    , 'research-daniel-markovitz': { path: 'awards/prize-research/research-daniel-markovitz' }

    /* GET gemba walk */
    , 'research-michael-bremer': { path: 'awards/prize-research/research-michael-bremer-gemba-walk' }

    /* GET vistaprint*/
    , 'research-jeffrey-liker': { path: 'awards/prize-research/research-jeffrey-liker' }
}

Object.keys(routes).forEach(name => {
    const route = routes[name]
    router.get(`/${name}`, (req, res, next) => { res.render(route.path, { title: route.title || 'Recipients - Shingo Institute' }) })
})


/* Historical .pdf */
//Served Statically as .pdf file. Can be found at public/assets/press

module.exports = router;
