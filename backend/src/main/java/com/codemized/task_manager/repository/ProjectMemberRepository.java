package com.codemized.task_manager.repository;

import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.ProjectMember;
import com.codemized.task_manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByUser(User user);

    List<ProjectMember> findByProject(Project project);

    Optional<ProjectMember> findByProjectAndUser(Project project, User user);

}
