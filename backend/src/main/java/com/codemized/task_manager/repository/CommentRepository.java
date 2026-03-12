package com.codemized.task_manager.repository;

import com.codemized.task_manager.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTaskId(Long taskId);

}