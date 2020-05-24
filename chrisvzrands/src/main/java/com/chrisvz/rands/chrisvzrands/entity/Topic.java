package com.chrisvz.rands.chrisvzrands.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
@Entity
@Table(name = "topic")
public class Topic implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "news_day")
	private String newsDay;

	@Column(name = "topic")
	private String topic;

	@Column(name = "active")
	@Builder.Default
	private String active = "N";
	
	 @OneToMany(targetEntity=Article.class,cascade = CascadeType.ALL, 
             fetch = FetchType.LAZY, orphanRemoval = true)
	@Builder.Default
    private List<Article> articles = new ArrayList<>();	
	
	
}
