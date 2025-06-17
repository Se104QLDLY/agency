import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

export interface LoginFormInputs {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
});

export const useLoginForm = () => {
  const [loginType, setLoginType] = useState<'admin' | 'client'>('admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log(data, { loginType });
    // Simulate login
    setIsLoggedIn(true);
    setUserName(data.username);
    
    // Navigate to admin dashboard after successful login
    navigate('/admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setShowAccountMenu(false);
  };
  
  const toggleAccountMenu = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  return {
    loginType,
    setLoginType,
    isLoggedIn,
    setIsLoggedIn,
    showAccountMenu,
    userName,
    toggleAccountMenu,
    handleLogout,
    register,
    handleSubmit,
    errors,
    onSubmit
  };
};