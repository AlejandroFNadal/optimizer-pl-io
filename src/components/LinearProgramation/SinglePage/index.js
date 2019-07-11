import React from "react";
import { Container, Col, Row, Jumbotron} from "reactstrap";
import ModalModels from "../../Models"
import Configuration from "../Configuration";
import Processing from "../Processing";
import Presentation from "../Presentation";
import logo from "../logo.svg";

class SinglePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model:{
        variables: [{ xi: 0, descripcion: "", coeficiente: "" }, { xi: 1, descripcion: "", coeficiente: "" }],
        restricciones: [{ ri: 0, descripcion: "", coeficientes: [], eq: ">=", derecha: "" }],
        method: "graph",
        objective: "max",
        integer: false
      },
      result: false,
      modelsOpen:false
    };
  }
componentDidMount(){
    let result = this.validateCoeficientes();
    this.setState({result});
  }

componentDidUpdate(prevState){
    if ( prevState !== this.state ) {
        if ( this.state.changes ){
            let result = this.validateCoeficientes();
            this.setState({ result, changes:false });
            }
        }    
    }

  //Esta función maneja el cambio en las restricciones
  handleRestricciones = restricciones => {
    let { model } = this.state;
    model.restricciones = restricciones;
    this.setState({ model, changes: true });
  };
  //Esta función maneja el cambio en las variables
  handleVariables = variables => {
    let { model } = this.state;
    model.variables = variables;
    this.setState({ model, changes: true });
  };
  //Esta función maneja el cambio del metodo
  handleMethod = method => {
    let { model } = this.state;
    model.method = method;
    this.setState({ model, changes: true });
  };
  //Esta función maneja el cambio del objetivo de optimización
  handleObjective = objective => {
    let { model } = this.state;
    model.objective = objective;
    this.setState({ model, changes: true });
  };
  toggleInteger = () => {
    let { model } = this.state;
    model.integer = !model.integer;
    this.setState({ model, changes: true });

  }
  //Esta función guarda el resultado (inutilizada por el momento)
  handleResult = result => this.setState({ result });

  //Esta función habilita el cálculo en el último paso
  lastStep = step => console.log('Changes')

  finishButtonClick = result => console.log("En algún momento va a imprimir resultados");

  validateCoeficientes = () =>{

    let {variables, restricciones }= this.state.model;
    //Verificando si los coeficientes de las variables y las restricciones no son nulos
    let varsOperatives = variables.filter(va => va.descripcion !== ""); 
    let verifQty = varsOperatives.length ? varsOperatives.every(va => va.coeficiente !== "") : false; 
    console.log(verifQty);
    let restOperatives = restricciones.filter(re => re.descripcion !== "");
    let veriResQty = restOperatives.length ? restOperatives.every(re => re.coeficientes.every(co => co !== "") && re.derecha !== ""):false;
    console.log(veriResQty);
    
    if (verifQty && veriResQty) { 
        console.log('True')
        return true } else return false

  };
  
  showModels = () => this.setState({modelsOpen:!this.state.modelsOpen});

  setModel = model => this.setState({ model, changes:true });

  render() {
    let { modelsOpen, model, result } = this.state
    return (
      <Container fluid className="App">
        <Row className="">
          <Col xs={12} md={6} className="mx-auto">
            <img src={logo} className="App-logo" alt="logo" height="200" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className="my-4 mx-auto ">
            <Row>
                <Jumbotron className='w-100'>
                    <Configuration   status={model}
                    handleMethod={this.handleMethod}
                    handleVariables={this.handleVariables}
                    handleRestricciones={this.handleRestricciones}
                    lastStep={this.lastStep}
                    toggleInteger={this.toggleInteger}
                    handleObjective={this.handleObjective}
                    showModels={this.showModels}/>
                </Jumbotron>  
            </Row>

            <Row>
                <Jumbotron className='w-100'>
                    <Processing status={model} handleVariables={this.handleVariables}
                    handleRestricciones={this.handleRestricciones} lastStep={this.lastStep}/>
                </Jumbotron>
                
            </Row>

            <Row>
                <Jumbotron className='w-100'>
                    <Presentation status={model} result={result} handleResult={this.handleResult} lastStep={this.lastStep}/>
                </Jumbotron>
            </Row>
          
          </Col>
        </Row>
        <Row><ModalModels open={modelsOpen} model={model} setModel={this.setModel} handleClose={this.showModels}/></Row>
      </Container>
    );
  }
}

export default SinglePage;
