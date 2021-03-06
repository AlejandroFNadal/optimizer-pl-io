const algebra = require('algebra.js');
const math = require('mathjs');
const { Expression } = require('algebra.js');
const { exp, expression } = require('mathjs');
const Equation = algebra.Equation;
const Parser = require('expr-eval').Parser;
var parser = new Parser();
const algebrite = require('algebrite');

//console.log(algebrite.nroots('-(0*(0*x))^2-(0*(-2*x)+1)^2').toString())     -(x-4)^2-(3*(y-2)^2)-4  -(x^2)-(y+1)^2
const fGradiente = (funcionObjetivo,puntoa,puntob,e,Objetivo) => {
     
     var Z=funcionObjetivo.toString();
     var a=puntoa;
     var b=puntob;
     var epsilon=0;
     var objetivo=Objetivo.toString();
     const expr = parser.parse(Z);

     var deltaf = [];
     var x0 = [];
     var x1conR = [];
     var x1 = [];
     var valorR;
     var ZconR;
     var derivadaExpr = [];
     var Z0;
     var Z1;
     var helper;
     var regder = /\d r/;
     var regiz = /r \d/;

     // Defino el punto X0
     x0 = [a,b];
     var x=0; //Solo uso para pausar un rato la ejecucion
     // Reemplazo X0 en la funcion z
     Z0 = expr.evaluate({x: x0[0], y: x0[1]});
     Z1 = 0;
     valorR = 1;
     var salida = 0;

     // Derivo la funcion respecto a  x y respecto a y
     derivadaExpr = [ math.derivative(expr.toString(),'x') , math.derivative(expr.toString(),'y')];
     //al principio, la primera comparacion es 1>0 y salida arranca en 0
     while (((math.abs(valorR)) > epsilon) && (salida < 29)){

          epsilon=e;
          // La variable salida representa la condicion en la que el punto se encuentra en el infinito
          salida = salida + 1;
          
          /*console.log('derivadaExpr');
          console.log(derivadaExpr[0].toString(),'\\',derivadaExpr[1].toString());

          console.log('X0 al INICIO');
          console.log(x0[0],x0[1]);*/

          // Evaluo x0 en las derivadas 
          deltaf[0]=derivadaExpr[0].evaluate({x: x0[0], y: x0[1]});
          deltaf[1]=derivadaExpr[1].evaluate({x: x0[0], y: x0[1]});
          
          /*console.log("Deltaf tras la evaluacion de las derivadas en x0")
          console.log(deltaf)*/

          /*
          //Este parseo, no lo dudes, funciona
          if (math.abs(parseFloat(deltaf[0].toString())) < 0.0001){
               deltaf[0]=0;
          }
          if (math.abs(parseFloat(deltaf[1].toString())) < 0.0001){
               deltaf[1]=0;
          }
          */

          if (objetivo=='max'){
               deltaf = ['('+'('+deltaf[0]+')'+'*r)','('+'('+deltaf[1]+')'+'*r)'];
          }else{
               deltaf = ['-('+'('+deltaf[0]+')'+'*r)','-('+'('+deltaf[1]+')'+'*r)'];
          }
          
          /*console.log("deltaf tras sumarle el caracter r")
          console.log(deltaf)*/
          
          deltaf = [ math.simplify(deltaf[0]) , math.simplify(deltaf[1]) ];
          
          /*console.log("deltaf tras la simplificacion")
          console.log(deltaf.toString())*/
          
          // Genero el punto X1 el cual contiene una variable r que despues tendremos que despejar
          if (x0[0]===0){
               x1conR[0]='('+deltaf[0]+')';
          }else{
               x1conR[0]=x0[0]+'+('+deltaf[0]+')';
          }

          /*console.log("x1conR")
          console.log(x1conR)*/

          if (x0[1]===0){
               x1conR[1]='('+deltaf[1]+')';
          }else{
               x1conR[1]=x0[1]+'+('+deltaf[1]+')';
          }

          /*console.log("x1conR")
          console.log(x1conR)*/
          //x1conR = [ x0[0]+'('+deltaf[0]+')' , x0[1] +'('+ deltaf[1]+')' ];
          //x1conR = [ math.simplify(x1conR[0]) , math.simplify(x1conR[1]) ];

          x1conR = [ (x1conR[0].toString()) , (x1conR[1].toString()) ];

          /*console.log("x1con R tras la simplificacion")
          console.log(x1conR)*/

          // Aca se corrige el error de que por algun motivo elimina el simbolo *
          if (x1conR[0].match(regder) != null)
          {
               x1conR[0]=x1conR[0].split(" r").join("* r");
          }
          if (x1conR[1].match(regder) != null)
          {
               x1conR[1]=x1conR[1].split(" r").join("* r");
          }

          if (x1conR[0].match(regiz) != null)
          {
               x1conR[0]=x1conR[0].split("r ").join("r *");
          }
          if (x1conR[1].match(regiz) != null)
          {
               x1conR[1]=x1conR[1].split("r ").join("r *");
          }
          /*console.log("x1conR tras el split join de r evaluado con las regexp")
          console.log(x1conR)*/

          // Se simplifica para que sea mas facil realizar la wea
          x1conR = [ math.simplify(x1conR[0]) , math.simplify(x1conR[1]) ];
          /*console.log("Simplificacion de x1 tras el split join")
          console.log(x1conR.toString())*/


          // Reemplazo los valores de X1 en la funcion objetivo y luego despejo r
          Z = Z.split("x").join("(x)")
          Z = Z.split("y").join("(y)")
          ZconR = Z.split("x").join(x1conR[0]);
          ZconR = ZconR.split("y").join(x1conR[1]);
          
          if ( (ZconR).includes("r") ){
               //Aca se despejaria r pero nada anda por ahora
               helper = ZconR.split("r").join("x");
               /*console.log("ZconR reemplazado r por x")
               console.log(helper.toString())*/
               helper = (helper.toString()).split("+ -").join("-");
               helper = (helper.toString()).split("+-").join("-");
               helper=math.derivative(helper.toString(),'x');
               /*console.log("Helper antes")
               console.log(helper.toString())*/


               helper=math.rationalize(helper);
               

               valorR = algebrite.nroots(helper.toString());
               /*console.log("raices de helper")
               console.log(valorR.toString())*/
               valorR=valorR.toString()
               /*
                    aca intento evaluar la expresion
               */
               //Eliminacion de corchetes
               valorR=valorR.replace('[','')
               valorR=valorR.replace(']','')

               var arregloRaices= valorR.split(',')
               var arregloRaicesEvaluado=[]

               /*console.log("ArregloRaices")
               console.log(arregloRaices)*/
               arregloRaices.forEach(element=>{
                    arregloRaicesEvaluado.push(eval(element))
               })
               /*console.log("Evaluacion de las raices")
               console.log(arregloRaicesEvaluado)*/
          }
          valorR = arregloRaicesEvaluado[0]
          // Reemplazo r en X1
          x1 = [ (Parser.parse(x1conR[0].toString())).evaluate({r: eval(valorR)}) , (Parser.parse(x1conR[1].toString())).evaluate({r: eval(valorR.toString())}) ];

          if(((math.abs(x0[0]-x1[0]))<(epsilon*0.01)) && ((math.abs(x0[1]-x1[1]))<(epsilon*0.01))){
               salida=30;
          }

          // Calculamos 
          Z1 = expr.evaluate({x: x1[0], y: x1[1]});
          x0 = [ x1[0] , x1[1] ];
     }

     if ((isNaN(x1[0])) || (isNaN(x1[1]))){
          x1 = [ -Infinity , Infinity ];
     } 
     if ((x1[0])>9999999 || (x1[1])>9999999){
          x1 = [ -Infinity , Infinity ];
     } 
     return x1;

}

//console.log(fGradiente("-((x-4)^2)+(3*((y-2)^2))-4",1,1,0.1,"max"));
//console.log(fGradiente("(4*x)+(6*y)-(2*(x^2))-(2*x*y)-(2*(y^2))",1,1,0.1,"max"));

module.exports = fGradiente
