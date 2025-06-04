package org.javaweb.service.impl;

import org.javaweb.converter.UserConverter;
import org.javaweb.entity.UserEntity;
import org.javaweb.model.dto.UserDTO;
import org.javaweb.repository.UserRepository;
import org.javaweb.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserConverter userConverter;

    @Override
    public UserDTO getUserByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("<User Not Found>"));
        UserDTO userDTO = userConverter.convertToUserDTO(userEntity);
        return userDTO;
    }

    @Override
    public UserDTO updateUser(String email, UserDTO userDTO) {
        UserEntity userEntity =  userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("<User Not Found>"));

        userEntity.setFullname(userDTO.getFullname());
        userEntity.setNumberphone(userDTO.getNumberphone());
        userEntity.setAddress(userDTO.getAddress());

        userRepository.save(userEntity);
        return  userConverter.convertToUserDTO(userEntity);
    }
}
