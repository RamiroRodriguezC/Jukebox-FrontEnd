import React from 'react';
import { loginUser } from '../services/AuthService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message, Flex, Form, Input } from 'antd';
const Login = () => {
  const onFinish = async (values) => {
    try {
        // "values" contiene lo que el usuario escribió en los inputs
        const data = await loginUser(values.mail, values.password);
        
        // Si sale bien, guardamos el token y el usuario en el navegador
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        message.success('¡Bienvenido de vuelta!');
        
        // Redirigimos a la home (que crearemos después)
        navigate('/home'); 
    } catch (error) {
        // Si los datos son incorrectos, AntD nos ayuda a mostrar el error
        (message.error(error.toString() || "Error desconocido"));
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