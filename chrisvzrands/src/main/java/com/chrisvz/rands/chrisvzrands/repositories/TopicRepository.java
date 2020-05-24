package com.chrisvz.rands.chrisvzrands.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.chrisvz.rands.chrisvzrands.entity.Topic;

public interface TopicRepository extends CrudRepository<Topic, Long> {

	
	@Modifying
	@Transactional
	@Query(value="update topic set active='Y' where id = ?", nativeQuery = true)
	public void activateTopic(@Param("id") Long id);
	
	@Modifying
	@Transactional
	@Query(value="update topic set active='N' where id = ?", nativeQuery = true)
	public void suspendTopic(@Param("id") Long id);

	@Query(value="select t from Topic t where t.newsDay = Date(NOW()) order by id desc")
	public List<Topic> findAllOrderByIdDesc();
	
	@Query(value="SELECT * FROM topic WHERE news_day BETWEEN CURDATE() - INTERVAL 2 DAY AND DATE(now()) order by id desc", nativeQuery = true)
	public List<Topic> findTwoDaysNewsOrderByIdDesc();

	@Query(value="SELECT * FROM topic WHERE news_day = ? order by id desc", nativeQuery = true)
	public List<Topic> findNewsByDate(@Param("newsDay") String newsDay);
	
	@Query(value="SELECT * FROM topic WHERE active = 'Y' and news_day BETWEEN CURDATE() - INTERVAL 2 DAY AND DATE(now()) order by id desc", nativeQuery = true)
	public List<Topic> getTodaysFeed();
	
	
}
