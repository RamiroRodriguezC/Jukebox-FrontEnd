import React from 'react';
import { loginUser } from '../services/AuthService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Flex, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';


const Login = ({ setUser }) => {
  const navigate = useNavigate(); // 2. INICIALIZAR LA FUNCIÓN
  const onFinish = async (values) => {
  try {
    const data = await loginUser(values.mail, values.password);
    
    // 1. Guardamos en disco
    localStorage.setItem('user', JSON.stringify(data.usuario));
    
    // 2. Intentamos avisar a la App
    if (typeof setUser === 'function') {
        console.log("Enviando usuario al estado global...");
        setUser(data.usuario); 
    } else {
        console.error("ERROR: setUser no es una función. Revisá cómo pasaste la prop en App.js");
    }

    navigate('/'); 
  } catch (error) { 
    message.error('Error al iniciar sesión: ' + error.message);
  }
};
  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Form.Item
          name="mail"
          rules={[{ required: true, message: 'El mail no puede estar vacio!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Mail" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'La contraseña no puede estar vacia!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          or <a href="">Register now!</a>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;