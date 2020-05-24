import React from 'react';
import axios from 'axios'
// import {receiveUser} from '../../actions/actions'
// import * as actions from '../../actions/actions'
import {connect} from 'react-redux'
import {validateUrl, formatDate} from '../../Common'
import { Button} from 'reactstrap';

import './TopicForm.css'

var validChars = 'abcdefghijklmnopqrstuvwxyz;,!@#$%^&*()-\~`+=[}]{,./ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

var jsonPayload = JSON.parse('{"active" : "N", "uid" : "", "topic" : "", "newsDay" : "", "articles" : [{"tilt" : "D", "text" : "", "url" : "", "imageUrl" : "", "source" : ""},{"tilt" : "R", "text" : "", "url" : "", "imageUrl" : "", "source" : ""}]}');
jsonPayload.newsDay = formatDate(new Date());

let invalidLoginAttempts = 0;

    


const getUrlClass = (urlValidityFlag, sourceMatchFlag) => {
    return (
        urlValidityFlag ?
            sourceMatchFlag ?
                'valid inputs' 
                : 
                'source-mismatch inputs'
        :
            'invalid inputs'
    );
}   

const contains = (fieldA, fieldB) => {
    if (fieldA && fieldB) {
        return fieldA.includes(fieldB)
    } else {
        return true;
    }
}

class TopicForm extends React.Component {
    constructor(props) {
        super(props);
        this.onErrorChange = this.onErrorChange.bind(this);

        this.onUserNameChange = this.onUserNameChange.bind(this);
        this.onPsswdChange = this.onPsswdChange.bind(this);

        this.onDateChange = this.onDateChange.bind(this)
        this.onTopicChange = this.onTopicChange.bind(this);

        this.onLiberalSourceChange = this.onLiberalSourceChange.bind(this);
        this.onLiberalUrlChange = this.onLiberalUrlChange.bind(this);
        this.onLiberalTextChange = this.onLiberalTextChange.bind(this);
        this.onLiberalImageChange = this.onLiberalImageChange.bind(this);
        this.onLiberalAuthorChange = this.onLiberalAuthorChange.bind(this);
        
        this.onConservativeSourceChange = this.onConservativeSourceChange.bind(this);
        this.onConservativeUrlChange = this.onConservativeUrlChange.bind(this);
        this.onConservativeTextChange = this.onConservativeTextChange.bind(this);
        this.onConservativeImageChange = this.onConservativeImageChange.bind(this);
        this.onConservativeAuthorChange = this.onConservativeAuthorChange.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            topic: props.topic ? props.topic.topic : '',
            newsDay: props.newsDay ? props.newsDay : formatDate(new Date()),
            active: props.active==='Y' ? props.active : 'N',
            error: '',
            bob: props.bob ? props.bob : 'sdfdsf',
            
            // isLiberalUrlValid: true,
            // isLiberalImageUrlValid: true,
            // isConservativeUrlValid: true,
            // isConservativeImageUrlValid : true,
            
            // doesLiberalUrlMatchSource: true,
            // doesLiberalImageUrlMatchSource: true,
            // doesConservativeUrlMatchSource: true,
            // doesConservativeImageUrlMatchSource : true,
            
            username: 'kitnkayj@yahoo.com',
            psswd: 'Kyle$Nube',
            isLoggedIn: null, 
            isUserLocked: false,
            areInputsValid: false
        };


    }

    handleKeyPress = (e) => {
        var evt = e || window.event;
        
        var keyCode = evt.charCode || evt.keyCode;
        if (keyCode === 8) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        }

        if (validChars.includes(e.key)) {
            e.preventDefault();
        }

    }


validateForm() {
    this.setState(() => ({doesLiberalUrlMatchSource : contains(this.state.liberalUrl, this.state.liberalSource)}))
    this.setState(() => ({doesLiberalImageUrlMatchSource : contains(this.state.liberalImage, this.state.liberalSource)}))
    this.setState(() => ({doesConservativeUrlMatchSource : contains(this.state.conservativeUrl, this.state.conservativeSource)}))
    this.setState(() => ({doesConservativeImageUrlMatchSource : contains(this.state.conservativeImage, this.state.conservativeSource)}))

    this.setState( () => ( {isLiberalUrlValid : validateUrl(this.state.liberalUrl)}))
    this.setState( () => ( {isConservativeUrlValid : validateUrl(this.state.conservativeUrl)}))
    this.setState( () => ( {isLiberalImageUrlValid : validateUrl(this.state.liberalImage)}))
    this.setState( () => ( {isConservativeImageUrlValid : validateUrl(this.state.conservativeImage)}))
}    


isValidInput() {
    this.validateForm()
    var x = this.state.isLiberalUrlValid && 
    this.state.isLiberalImageUrlValid && 
    this.state.doesLiberalUrlMatchSource && 
    this.state.doesLiberalImageUrlMatchSource && 
    this.state.isConservativeUrlValid && 
    this.state.isConservativeImageUrlValid &&  
    this.state.doesConservativeUrlMatchSource &&  
    this.state.doesConservativeImageUrlMatchSource;
     return x;
 }

addTopic = async (jsonData) => {
    var x = this.validateForm();
    var z = this.isValidInput();
    if (this.isValidInput()) {
        let res = await axios.post(`http://localhost:8080/api/topics/create`, jsonData);
        let { data } = res.data;
        this.props.history.push("/viewheadlines")
    }
};







async lockUser(username) {
    let userData = await axios.put(`http://localhost:8080/api/lockAccount/${username}`, {
        params: {
        username: username
        }
    });
}


async fetchUser(username, psswd) {
    let userData = await axios.get(`http://localhost:8080/api/login/${username}/${psswd}`, {
        params: {
        username: username,
        psswd: psswd
        }
    });

    var isLoggedIn = userData.data.valid
    if (!isLoggedIn) {
        invalidLoginAttempts = invalidLoginAttempts + 1
        var isUserLocked = invalidLoginAttempts > 4 ? true : false;
        if (isUserLocked) this.lockUser(username)
    } else {
        invalidLoginAttempts = 0;
    }


    this.setState({
        ...this.state, ...{
        isLoggedIn,
        isUserLocked
        }
    });

    console.log(isLoggedIn)
    console.log(isUserLocked)
    console.log(this.state.isLoggedIn)
    console.log(this.state.isUserLocked)
}





    onUserNameChange(e) {
        var username = e.target.value;
        this.setState(() =>({username: username}))
    }

    onPsswdChange(e) {
        var psswd = e.target.value;
        this.setState(() =>({psswd: psswd}))
    }

    onErrorChange(e) {
        const bob = e.target.value;
        this.setState(() => ({bob: bob}))
    }

    onDateChange(e) {
        const newsDay = e.target.value;
        this.setState(() => ({newsDay: newsDay}))
        jsonPayload.newsDay = this.state.newsDay;
    }

    onTopicChange(e) {
        const topic = e.target.value;
        this.setState(() => ({ topic: topic }));
        jsonPayload.topic = topic;
    }

    onLiberalSourceChange(e) {
        const liberalSource = e.target.value;
        this.setState(() => ({ liberalSource: liberalSource }));
        jsonPayload.articles[1].source = this.state.liberalSource
    }

    onLiberalTextChange(e) {
        const liberalText = e.target.value;
        this.setState(() => ({ liberalText: liberalText }));
        jsonPayload.articles[1].text = this.state.liberalText
    }

    onLiberalUrlChange(e) {
        const liberalUrl = e.target.value;
        this.setState(() => ({ liberalUrl: liberalUrl })
        );
        jsonPayload.articles[1].url = this.state.liberalUrl;        
    }

    onLiberalImageChange(e) {
        const liberalImage = e.target.value;
        this.setState(() => ({ liberalImage: liberalImage }));
        jsonPayload.articles[1].imageUrl = liberalImage
    }

    onLiberalAuthorChange(e) {
        const liberalAuthor = e.target.value;
        this.setState(() => ({ liberalAuthor: liberalAuthor}));
        jsonPayload.articles[1].author = liberalAuthor;
    }


    onConservativeSourceChange(e) {
        const conservativeSource = e.target.value;
        this.setState(() => ({ conservativeSource: conservativeSource }));
        jsonPayload.articles[0].source = conservativeSource;
    }

    onConservativeTextChange(e) {
        const conservativeText = e.target.value;
        this.setState(() => ({ conservativeText: conservativeText }));
        jsonPayload.articles[0].text = this.state.conservativeText;
    }

    onConservativeUrlChange(e) {
        const conservativeUrl = e.target.value;
        this.setState(() => ({ conservativeUrl: conservativeUrl }));
        jsonPayload.articles[0].url = conservativeUrl;
    }

    onConservativeImageChange(e) {
        const conservativeImage = e.target.value;
        this.setState(() => ({ conservativeImage: conservativeImage }));
        jsonPayload.articles[0].imageUrl = conservativeImage;
    }

    onConservativeAuthorChange(e) {
        const conservativeAuthor = e.target.value;
        this.setState(() => ({ conservativeAuthor: conservativeAuthor}));
        jsonPayload.articles[0].source = conservativeAuthor;
    }


    onSubmit(e) {
        //e.preventDefault();
        this.setState({error: ''})

        if (1==2 || !this.state.newsDay || !this.state.topic || !this.state.liberalAuthor || !this.state.conservativeAuthor ||
            !this.state.liberalSource || !this.state.liberalText || !this.state.liberalUrl || !this.state.liberalImage ||
            !this.state.conservativeSource || !this.state.conservativeText || !this.state.conservativeUrl || !this.state.conservativeImage
            ) {
            this.setState(() => ({ error: 'Please populate ALL fields before attempting to submit' }));
        } else {
            this.setState(() => ({doesLiberalUrlMatchSource : contains(this.state.liberalUrl, this.state.liberalSource)}))
            this.setState(() => ({doesLiberalImageUrlMatchSource : contains(this.state.liberalImage, this.state.liberalSource)}))
            this.setState(() => ({doesConservativeUrlMatchSource : contains(this.state.conservativeUrl, this.state.conservativeSource)}))
            this.setState(() => ({doesConservativeImageUrlMatchSource : contains(this.state.conservativeImage, this.state.conservativeSource)}))

            this.setState( () => ( {isLiberalUrlValid : validateUrl(this.state.liberalUrl)}))
            this.setState( () => ( {isConservativeUrlValid : validateUrl(this.state.conservativeUrl)}))
            this.setState( () => ( {isLiberalImageUrlValid : validateUrl(this.state.liberalImage)}))
            this.setState( () => ( {isConservativeImageUrlValid : validateUrl(this.state.conservativeImage)}))

            this.setState(() => ({ bob: '' }));

//            var jsonPayload = JSON.parse('{"uid" : "", "topic" : "", "newsDay" : "", "articles" : [{"tilt" : "", "text" : "", "url" : "", "imageUrl" : "", "source" : ""},{"tilt" : "", "text" : "", "url" : "", "imageUrl" : "", "source" : ""}]}');
            jsonPayload.newsDay = this.state.newsDay;
            jsonPayload.topic = this.state.topic;
            jsonPayload.articles[0].tilt = 'D';
            jsonPayload.articles[0].text = this.state.conservativeText;
            jsonPayload.articles[0].url = this.state.conservativeUrl;
            jsonPayload.articles[0].imageUrl = this.state.conservativeImage;
            jsonPayload.articles[0].source = this.state.conservativeSource;
            jsonPayload.articles[0].author = this.state.conservativeAuthor;
            jsonPayload.articles[1].tilt = 'R';
            jsonPayload.articles[1].text = this.state.liberalText;
            jsonPayload.articles[1].url = this.state.liberalUrl;
            jsonPayload.articles[1].imageUrl = this.state.liberalImage;
            jsonPayload.articles[1].source = this.state.liberalSource;
            jsonPayload.articles[1].author = this.state.liberalAuthor;

            const topic =
                {
                    topic: this.state.topic,
                    newsDay: this.state.newsDay,    
                    active: 'N',
                    articles: jsonPayload.articles,
                    bob: this.state.bob
                }
         
            alert(JSON.stringify(topic))
            this.props.addTopic(topic);
        
                return JSON.stringify(topic)
        }
    }

    render() {
        return (
            <div>
            <section style={{display: this.state.isLoggedIn ? 'block' : 'block'}} className='container'>
            <table style={{display: 
                (this.state.isLiberalUrlValid && 
                this.state.isLiberalImageUrlValid && 
                this.state.doesLiberalUrlMatchSource &&
                this.state.doesLiberalImageUrlMatchSource &&
                this.state.isConservativeUrlValid &&
                this.state.isConservativeImageUrlValid && 
                this.state.doesConservativeUrlMatchSource && 
                this.state.doesConservativeImageUrlMatchSource) ? 'none' : 'block'
                , Left: '10px'}}>
                    <tbody>
                <tr>
                    <td><img alt='red flag' src='../../image/redflag.gif' style={{height: '30px'}}/></td><td><label style={{fontSize: '1.3em'}}>Url is not valid</label></td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <td><img alt='yellow flag' src='../../image/yellowflag.png' style={{height: '25px'}}/></td><td><label style={{fontSize: '1.3em'}}>Url does not match article source</label></td>
                </tr>
                </tbody>
            </table>
            <div>
                <div className='left-half'>
              

                {/* <textarea rows="3" cols="60" 
                                            value={this.state.bob}
                                            onChange={this.onErrorChange} /> */}
             
                    <form
                     //onSubmit={this.onSubmit} 
                     className='add-topic-form'>
                    
                    <input style={{marginLeft: '0px', marginBottom: '10px'}} type="text" maxLength="10" size="10" 
                                autoFocus
                            value={this.state.newsDay}
                            onChange={this.onDateChange} />

                    <input style={{marginLeft: '10px'}} className='uppercase' type="text" maxLength="50" size="54" 
                            placeholder="topic" autoFocus
                            value={this.state.topic}
                            onChange={this.onTopicChange} />


                        <div className='liberal-container'>
                        <img style={{marginLeft: '10px', marginBottom: '10px'}} src='../../image/donkey.png' width="30"/><label class='card-heading'>Liberal Leaning</label>
                            <br></br>
                        
                        <input className='inputs' size="60" placeholder="Paste Link To Headline Text"
                            value={this.state.liberalText}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onLiberalTextChange} /><br></br>

                        <img alt='red flag' style={{display: this.state.isLiberalUrlValid ? 'none' : 'inline-block', width: '35px', marginLeft: '10px'}} 
                        src='../../image/redflag.gif'/>

                        <img alt='yellow flag' style={{display: (this.state.isLiberalUrlValid && !this.state.doesLiberalUrlMatchSource) ? 'inline-block' : 'none', width: '35px', marginLeft: '10px'}} 
                        src='../../image/yellowflag.png'/>
                        
                        <input 
                        className='valid inputs'
                            size="60" placeholder="Paste Link To Article"
                            value={this.state.liberalUrl}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onLiberalUrlChange} /><br></br>
                    

                        <img alt='red flag' style={{display: this.state.isLiberalImageUrlValid ? 'none' : 'inline-block', width: '35px', marginLeft: '10px'}} 
                        src='../../image/redflag.gif'/>

                        <img alt='yellow flag' style={{display: (this.state.isLiberalImageUrlValid && !this.state.doesLiberalImageUrlMatchSource) ? 'inline-block' : 'none', width: '35px', marginLeft: '10px'}} 
                        src='../../image/yellowflag.png'/>

                        <input className='valid inputs' 
                        size="60" placeholder="Paste Link To Article Image"
                            value={this.state.liberalImage}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onLiberalImageChange} />
                        <br></br>

                        <select className='inputs' name="LiberalSource" value={this.state.liberalSource} onChange={this.onLiberalSourceChange}> 
                                <option value="--Select a Source--">--Select a Source--</option>
                                <option value="theatlantic.com">theatlantic.com</option>
                                <option value="cnn.com">cnn.com</option>
                                <option value="thedailybeast.com">thedailybeast.com</option>
                                <option value="thegaurdian.com">theguardian.com</option>
                                <option value="huffpost.com">huffpost.com</option>
                                <option value="msnbc.com">msnbc.com</option>
                                <option value="newrepublic.com">newrepublic.com</option>
                                <option value="politico.com">politico.com</option>
                                <option value="slate.com">slate.com</option>
                                <option value="talkingpointsmemo.com">talkingpointsmemo.com</option>
                                <option value="time.com">time.com</option>
                                <option value="treehugger.com">treehugger.com</option>
                        </select>&nbsp;&nbsp;
                        
                        <input className='inputs' type="text" maxLength="60" size="30" placeholder="Paste Link To Author" 
                            autoFocus
                            value={this.state.liberalAuthor}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onLiberalAuthorChange} />
                        
                        </div>  

                    <br></br>

                        <div className='conservative-container'>
                            <img style={{marginLeft: '10px', marginBottom: '10px'}} src='../../image/elephant.png' width="30"/><label class='card-heading'>Conservative Leaning</label>
                            <br></br>
                        
                        <input className='inputs' size="60" placeholder="Paste Link To Headline Text"
                            value={this.state.conservativeText}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onConservativeTextChange} /><br></br>

                        <img alt='red flag' style={{display: this.state.isConservativeUrlValid ? 'none' : 'inline-block', width: '35px', marginLeft: '10px'}} 
                        src='../../image/redflag.gif'/>

                        <img alt='yellow flag' style={{display: (this.state.isConservativeUrlValid && !this.state.doesConservativeUrlMatchSource) ? 'inline-block' : 'none', width: '35px', marginLeft: '10px'}} 
                        src='../../image/yellowflag.png'/>


                        <input className='valid inputs' 
                            size="60" placeholder="Paste Link To Article"
                            value={this.state.conservativeUrl}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onConservativeUrlChange} /><br></br>

                        <img alt='red flag' style={{display: this.state.isConservativeImageUrlValid ? 'none' : 'inline-block', width: '35px', marginLeft: '10px'}} 
                        src='../../image/redflag.gif'/>

                        <img alt='yellow flag' style={{display: (this.state.isConservativeImageUrlValid && !this.state.doesConservativeImageUrlMatchSource) ? 'inline-block' : 'none', width: '35px', marginLeft: '10px'}} 
                        src='../../image/yellowflag.png'/>
                        
                        <input className='valid inputs' 
                            size="60" placeholder="Paste Link To Article Image"
                            value={this.state.conservativeImage}
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onConservativeImageChange} />


                            <select className='inputs' name="ConservativeSource" value={this.state.conservativeSource} onChange={this.onConservativeSourceChange}> 
                                <option value="--Select a Source--">--Select a Source--</option>
                                <option value="americanthinker.com">americanthinker.com</option>
                                <option value="breitbart.com">breitbart.com</option>
                                <option value="dailycaller.com">dailycaller.com</option>
                                <option value="foxnews.com">foxnews.com</option>
                                <option value="nationalreview.com">nationalreview.com</option>
                                <option value="newsmax.com">newsmax.com</option>
                                <option value="nypost.com">nypost.com</option>
                                <option value="redstate.com">redstate.com</option>
                                <option value="theblaze.com">theblaze.com</option>
                                <option value="thefederalist.com">thefederalist.com</option>
                            </select>&nbsp;&nbsp;

                            <input className='inputs' type="text" maxLength="60" size="30" 
                            placeholder="Paste Link To Author" 
                            autoFocus
                            onKeyPress={this.handleKeyPress}
                            value={this.state.conservativeAuthor}
                            onChange={this.onConservativeAuthorChange} />
                            <br></br>

                        </div>

                        <Button id='submitBtn' onClick={() => this.addTopic(jsonPayload)} color="success" block>Submit</Button>

                    </form>
                </div>

                <div className='right-half'>
                    <div style={{marginLeft: '50px'}}>
                        <label style={{marginLeft: '-10px'}} className='topic'>{this.state.topic}</label><br></br><br></br>
                        <div className='col-width'><label className='headline-text blue'>{this.state.liberalText}</label><br></br></div>
                        <img style={{display: this.state.liberalImage ? 'block' : 'none'}} alt='liberalImage' className='image' width="180" src={this.state.liberalImage}/>
                        <label className='small-italic' style={{marginTop: '-30px', marginBottom: '-30px'}}>{this.state.liberalSource}</label><br></br>
                        <label className='small-italic'>{this.state.liberalAuthor}</label>

<hr></hr>
                        <div className='col-width'><label className='headline-text red'>{this.state.conservativeText}</label></div>
                        <img style={{display: this.state.conservativeImage ? 'block' : 'none'}} alt='conservativeImage' className='image' width="180" src={this.state.conservativeImage}/>
                        <label className='small-italic' style={{marginTop: '-30px', marginBottom: '-30px'}}>{this.state.conservativeSource}</label><br></br>
                        <label className='small-italic' style={{marginTop: '0px'}}>{this.state.conservativeAuthor}</label>
                    </div>

                    {this.state.error && <p className='error'>{this.state.error}</p>}
                    
                </div>
            </div>
            </section>
            
            {/* <div style={{display: this.state.isLoggedIn ? 'none' : 'block'}}>
                <input style={{marginLeft: '10px'}} type="text" maxLength="25" size="25" 
                    placeholder="USER NAME" autoFocus
                    value={this.state.username}
                    onChange={this.onUserNameChange} /><br></br><br></br>

                <input style={{marginLeft: '10px'}} type="text" maxLength="25" size="25" 
                    placeholder="PASSWORD" autoFocus
                    value={this.state.psswd}
                    onChange={this.onPsswdChange} /><br></br><br></br>

                <button style={{marginLeft: '10px'}}
                    onClick={() => this.fetchUser(this.state.username, this.state.psswd)}
                >Login</button>
            </div> */}
            
            {/* <div style={{color: 'red', display: this.state.isUserLocked ? 'block' : 'none'}}>
                <p>Were sorry, you're account has been locked due to to many incorrect login attempt's. 
                    Please contact technical support to have you're account unlocked. 
                    And yes, I'm miss-gramatisizing on purpose lol.</p>
            </div>

            <div style={{color: 'red', 
                display: this.state.isLoggedIn || this.state.isLoggedIn==null
                    ? 'none' : 'block'}}>
                <p>We're sorry, it appears you may have entered an invalid username/password combination. Please try again.</p>
            </div> */}

            </div>
        );
    }
}






const mapStateToProps = state => ({
    topic: state.topic,
    username: state.username,
    psswd: state.psswd
  });
  

// function mapDispatchToProps(dispatch) {
//     const mapDispatchToProps = dispatch => {
//         return {
//           //addTopic: (topic) => dispatch({ type: 'ADD_TOPIC', topic: topic })
//        //   fetchUser: (username, psswd) => dispatch({ type: 'RECEIVE_USER', username: username, psswd: psswd })          
//         }
//       }

// }

//export default connect(mapStateToProps, mapDispatchToProps)(TopicForm);
export default connect(mapStateToProps)(TopicForm);