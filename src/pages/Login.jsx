import React from 'react';
import { loginUser } from '../services/AuthService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Flex, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // 2. INICIALIZAR LA FUNCIÓN
  const onFinish = async (values) => {
  try {
    const data = await loginUser(values.mail, values.password);
    
    // 1. Guardamos en disco
    login(data.usuario, data.token); // Esto debería guardar el usuario y token en el contexto global y localStorage
    navigate('/'); // 3. Redirigimos a la página principal después de iniciar sesión
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
          or <a href="/register">Register now!</a>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;