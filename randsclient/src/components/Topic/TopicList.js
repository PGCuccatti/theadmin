import React, { Component } from 'react'
import axios from 'axios'
import fetch from 'cross-fetch'
import { goLiveWithTopic, suspendTopic, deleteTopic } from '../../actions/actions'
import { connect } from 'react-redux';
import './Topic.css'

const listArticles = (articles, active) => {

  return (
      articles.map((a, index) => {
          return (    
            <div key={index} className={active==="Y" ? 'active-background article-container' : 'hidden-background article-container'} key={index}>
                
                {/* ARTICLE */}
                {<a className={'article ' + (a.tilt==='R' ? 'republican-theme' : 'democrat-theme')} 
                    href={a.url}>{a.text}</a>}
                <br></br>

                {/* Image */}
                <div><img className='article-image' src={a.imageUrl} alt='Link to articleImage'/></div>

                {/* SOURCE */}  
                <label className='article-source'>{a.source}</label><br></br>
                <label className='article-author'>{a.author}</label>
    
            </div>    
          )})
  )}


const displayActionButtons = (active, id) => {
  return (
      <div className='action-buttons'>

          <button id='deleteTopicBtn' className='btn' onClick={deleteTopic(id)}>Delete</button>

          {
              active === "Y" ?
                  <button id='suspendTopicBtn' className='btn' onClick={suspendTopic(id)}>Hide</button>
              : 
              <button id='goLiveBtn' className='btn' onClick={goLiveWithTopic(id)}>Go Live</button>

          }
      </div>       
  )
}

class TopicList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: []
    }
  }

  componentWillMount() {
    //axios.get(`localhost:8080/api/topics`)
    axios.get(`http://localhost:8080/api/topics`)
      .then((result) => {
        const results = result;
        this.setState({results: results})
      }
  )
  }

  render() {
    if(this.state.results.length === 0)
    {
     return false //return false or a <Loader/> when you don't have anything in your message[]
    }

    return (
        //data.data.map((topic,i) => (
        this.state.results.data.map((topic, i) => (
            <div> 

              <h4 className={topic.active==="Y" ? 'aactive-background topic-container' : 'ahidden-background topic-container'}>
                      <label key={i} style={{marginLeft: '10px'}}>{topic.newsDay} {topic.topic}</label></h4>



              <div style={{left: topic.active==="Y" ? '450px' : '20px'}}>

                <div>
                    {listArticles(topic.articles, topic.active)}
                </div>

                <div>
                


                    {displayActionButtons(topic.active, topic.id)}
                </div>

              <hr></hr>
            </div>
            
            </div>
    )
          

    )

    //  <div>
    //   {data.data.map((topic, index) => (
    //     <p key={index}>Hello, {topic.topic}</p>
    // ))}
    //    {JSON.stringify(data)}</div>

    )
    
  } // END OF RENDER

}

// TopicList.propTypes = {
//   topics: PropTypes.array.isRequired
// }



const mapStateToProps = state => ({
  topic: state.topic
});


const mapDispatchToProps = dispatch => {
  return {
    getTopics: () => dispatch({type: 'GET_TOPICS'}),
    goLiveWithTopic: (id) => dispatch({type: 'GO_LIVE', id: id}),
    suspendTopic: (id) => dispatch({type: 'SUSPEND_TOPIC', id: id }),
    deleteTopic: (id) => dispatch({type: 'DELETE_TOPIC', id: id })      
  }
}

export default connect(mapStateToProps , mapDispatchToProps)(TopicList);