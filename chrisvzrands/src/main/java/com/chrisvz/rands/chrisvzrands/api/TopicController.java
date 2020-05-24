package com.chrisvz.rands.chrisvzrands.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chrisvz.rands.chrisvzrands.entity.Topic;
import com.chrisvz.rands.chrisvzrands.repositories.TopicRepository;
import com.fasterxml.jackson.core.JsonProcessingException;

@CrossOrigin(origins = {"http://localhost:8081","http://localhost:3000"})
@RestController
@RequestMapping("/api")
public class TopicController {

	@Autowired
	TopicRepository topicRepository;

	// CREATE NEW TOPIC
	@PostMapping("/topics/create")
	public ResponseEntity<String> createTopic(@Valid @RequestBody Topic topic) {
		System.out.println("Create Topic: " + topic.getTopic() + "...");
		System.out.println(topic.toString());
		try {
			Topic t = topicRepository.save(topic);
			if(t!=null) {
				System.out.println("Saved Topic");
				return new ResponseEntity<>("Topic is saved", HttpStatus.OK);
			} else {
				return new ResponseEntity<>("Could not save topic", HttpStatus.FAILED_DEPENDENCY);
			}
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
			if (ex.getMessage().contains("ConstraintViolationException")) {
				return new ResponseEntity<>("This topic has already been used today.", HttpStatus.FAILED_DEPENDENCY);
			} else {
				return new ResponseEntity<>("Could not save topic (unknown reason)", HttpStatus.FAILED_DEPENDENCY);
			}
		}
	}
		
	// GET TOPIC
	@GetMapping("/edit/{id}")
	public ResponseEntity<Topic> getTopic(@PathVariable("id") Long id) {
		System.out.println("Get Topic by id...");

		Optional<Topic> topicData = topicRepository.findById(id);
		if (topicData.isPresent()) {
			return new ResponseEntity<>(topicData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	// GET ALL TOPICS FOR TODAY AND YESTERDAY
	@GetMapping("/topics")
	public ResponseEntity<List<Topic>> getAllTopicss() throws JsonProcessingException {
		
		System.out.println("Get all Topics...");

		List<Topic> list = new ArrayList<>();
		Iterable<Topic> topics = topicRepository.findTwoDaysNewsOrderByIdDesc();

		for (Topic topic : topics) {
			list.add(topic);
		}
		
		return new ResponseEntity<>(list, HttpStatus.OK);
	}


	// GET ALL TOPICS FOR PARTICULAR DATE
	@GetMapping("/topics/forDate/{newsDay}")
	public ResponseEntity<List<Topic>> getAllTopicsForDate(@PathVariable("newsDay") String newsDay) throws JsonProcessingException {
		
		System.out.println("Get all Topics for particular date...");

		List<Topic> list = new ArrayList<>();
		Iterable<Topic> topics = topicRepository.findNewsByDate(newsDay);

		for (Topic topic : topics) {
			list.add(topic);
		}
		
		return new ResponseEntity<>(list, HttpStatus.OK);
	}

	// GET TODAYS FEED
	@GetMapping("/topics/todaysFeed")
	public ResponseEntity<List<Topic>> getTodaysFeed() throws JsonProcessingException {
		
		System.out.println("Get Todays Feed...");

		List<Topic> list = new ArrayList<>();
		Iterable<Topic> topics = topicRepository.getTodaysFeed();

		for (Topic topic : topics) {
			list.add(topic);
		}
		
		return new ResponseEntity<>(list, HttpStatus.OK);
	}
	
	
	
	// DELETE TOPIC
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteTopic(@PathVariable("id") Long id) {
		System.out.println("Delete Topic with ID = " + id + "...");

		try {
			topicRepository.deleteById(id);
		} catch (Exception e) {
			return new ResponseEntity<>("Fail to delete!", HttpStatus.EXPECTATION_FAILED);
		}

		return new ResponseEntity<>("{\"Message\" : \"Topic is now deleted.\"}", HttpStatus.OK);
	}
	
	// GO LIVE WITH TOPIC
	@PutMapping("/activate/{id}")
	public ResponseEntity<String> activateTopic(@PathVariable Long id) {
		System.out.println("Activating Topic with topic id: " + id + "...");
		topicRepository.activateTopic(id);
		return new ResponseEntity<>("{\"Message\" : \"Topic is now activated.\"}", HttpStatus.OK);
	}
	

	// HIDE TOPIC
	@PutMapping("/suspend/{id}")
	public ResponseEntity<String> suspendTopic(@PathVariable Long id) {
		System.out.println("Suspending Topic with topic id: " + id + "...");
		topicRepository.suspendTopic(id);
		return new ResponseEntity<>("Topic is now hidden", HttpStatus.OK);
	}
	
	
	@PutMapping("/topic/update/{id}")
	public ResponseEntity<Topic> updateTopic(@PathVariable("id") Long id, @RequestBody Topic topic) {
		System.out.println("Update Topic with ID = " + id + "...");

		Optional<Topic> topicData = topicRepository.findById(id);
		
		if (topicData.isPresent()) {
			Topic savedTopic = topicData.get();
		
			savedTopic.setTopic(topic.getTopic());
			//savedTopic.setNewsDay(topic.getNewsDay());
			savedTopic.setActive(topic.getActive());
			savedTopic.setArticles(topic.getArticles());
			savedTopic.setId(topic.getId());

			Topic updatedTopic = topicRepository.save(savedTopic);
			return new ResponseEntity<>(updatedTopic, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}


}
