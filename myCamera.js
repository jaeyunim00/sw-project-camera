import React, { useState, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

export default function MyCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await sendToServer(photo.uri);
        alert('사진이 서버로 전송되었습니다.');
      } catch (error) {
        console.error('사진 처리 오류:', error);
      }
    }
  };

  const sendToServer = async (uri) => {
    console.log(uri);
    try {
      const formData = new FormData();
      const date = new Date();
      const timestamp = date.getTime(); // 현재 시간을 밀리초로 반환
      const filename = `photo_${timestamp}.jpg`; // 파일 이름 생성
      formData.append('carpark', {
        uri,
        type: 'image/jpeg',
        name: filename, // 동적으로 생성한 파일 이름 사용
      });

      // 원하는 API 엔드포인트 주소를 여기에 입력합니다.
      const response = await axios.post('http://172.20.91.217:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('서버 응답:', response.data); 
    } catch (error) {
      console.error('서버 전송 오류:', error);
    } 
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>카메라 접근 허용</Text>
        <Button onPress={requestPermission} title="확인" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.text}>찍기</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  camera: {
    height: "40%",
    width: "96%"
  },
  buttonContainer: {
    position: "absolute",
    top: -150,
    width: "100%"
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    width: "100%",
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
