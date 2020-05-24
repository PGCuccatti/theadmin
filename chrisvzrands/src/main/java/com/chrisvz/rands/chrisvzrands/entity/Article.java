package com.chrisvz.rands.chrisvzrands.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity(name = "TopicArticle")
@Table(name = "topic_article")
public class Article implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "tilt")
	private String tilt;
	
	@Column(name = "text")
	private String text;
	
	@Column(name = "url")
	private String url;
	
	@Column(name = "image_url")
	private String imageUrl;
	
	@Column(name = "source")
	private String source;
	 	
	@Column(name = "author")
	private String author;
	
	@ManyToOne
	private Topic topic;
		
}
