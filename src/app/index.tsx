import { Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { styles } from "./Styles";
import { MaskedTextInput } from 'react-native-mask-text';
import Button from "@/components/button";
import TokenStorage from "@/components/utils/tokenUtils";
import { router } from "expo-router"
import Toast from 'react-native-toast-message';

export default function index() {
    async function handleLogin() {
        const credenciais = {
            cpf: username,
            senha: password
        };

        try {
            await fetch(`http://192.168.0.5:8080/auth/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciais),
            }).then(async response => {
                const data = await response.json()
                if (!response.ok) {
                    throw new Error(data.mensagem)
                }

                await TokenStorage.storeToken(data.token)
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso!',
                    text2: 'Login realizado com sucesso'
                })
                setTimeout(() => {
                    router.navigate("/dashboard");
                }, 1000);
            })
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Erro!',
                text2: 'Erro ao realizar login: ' + error.message
            })
        }
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={[styles.title, { marginBottom: 20 }]}>ao seu agendador!</Text>
            <SafeAreaView>
                <MaskedTextInput mask="999.999.999-99" keyboardType="number-pad" onChangeText={(username) => setUsername(username)} style={styles.inputUser} placeholder="Nome de usuário (CPF)"></MaskedTextInput>
                <TextInput secureTextEntry={!showPassword} onChangeText={(password) => setPassword(password)} style={styles.inputUser} placeholder="Senha">
                </TextInput>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={{ color: 'blue' }}>Mostrar senha</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <Button title="Entrar" onPress={handleLogin} />
            <TouchableOpacity onPress={() => router.navigate("/register")}>
                <Text style={{ marginTop: 20 }}>
                    Ainda não tem uma conta?
                    <Text style={{ color: 'blue' }}> Cadastre-se</Text>
                </Text>
            </TouchableOpacity>
            <Toast />
        </SafeAreaView>
    )
}