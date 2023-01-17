const controller=require('../database/controller');

async function main(){
    const envNumber=3;
    await controller.updateForMissingUsers(envNumber)
    .then(()=>{
        console.log("Db updated");
    })
    .catch(err=>{
        console.error(err);
    })
}

main();