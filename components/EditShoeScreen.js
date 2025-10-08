import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { shoeService } from './shoeService';

const EditShoeScreen = ({ route, navigation }) => {
  const { shoe } = route.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productCode: shoe.productCode || '',
    productName: shoe.productName || '',
    size: shoe.size || null, 
    price: String(shoe.price || ''),
    quantity: String(shoe.quantity || ''),
  });

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSizeSelect = (selectedSize) => {
    setFormData((prev) => ({
      ...prev,
      size: selectedSize,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.productCode ||
      !formData.productName ||
      !formData.size ||
      !formData.price ||
      !formData.quantity
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

  setLoading(true);
  let shouldNavigateBack = false;
  const successMessage = 'Đã cập nhật sản phẩm';
  try {
        const dataToUpdate = {
        ...formData,
        price: formData.price,
        quantity: formData.quantity,
      };

      const response = await shoeService.updateShoe(shoe.id, dataToUpdate);
      if (response && response.status >= 200 && response.status < 300) {
        shouldNavigateBack = true;
      } else if (response && response.status === 404) {
        Alert.alert('Lỗi', 'Không tìm thấy sản phẩm để cập nhật.');
      } else {
        const bodyText = response && response.data ? JSON.stringify(response.data) : 'Không có nội dung phản hồi';
        Alert.alert('Lỗi', `Không thể cập nhật sản phẩm (Status: ${response?.status})\n${bodyText}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật sản phẩm.');
    } finally {
      setLoading(false);
      if (shouldNavigateBack) {
        if (Platform.OS === 'android') {
          ToastAndroid.show(successMessage, ToastAndroid.SHORT);
          navigation.goBack();
        } else if (Platform.OS === 'web') {
          alert(successMessage);
          navigation.goBack();
        } else {
          Alert.alert('Thành công', successMessage, [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CHỈNH SỬA SẢN PHẨM</Text>
        <View style={styles.titleUnderline} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Mã sản phẩm</Text>
        <TextInput
          style={styles.input}
          value={formData.productCode}
          onChangeText={(text) => handleInputChange('productCode', text)}
          placeholder="Nhập mã sản phẩm"
        />

        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          style={styles.input}
          value={formData.productName}
          onChangeText={(text) => handleInputChange('productName', text)}
          placeholder="Nhập tên sản phẩm"
        />

        <Text style={styles.label}>Chọn size</Text>
        <View style={styles.sizeSelectionContainer}>
          {availableSizes.map((s, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sizeButton,
                formData.size === s && styles.selectedSizeButton,
              ]}
              onPress={() => handleSizeSelect(s)}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  formData.size === s && styles.selectedSizeButtonText,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          value={formData.price}
          onChangeText={(text) => handleInputChange('price', text)}
          placeholder="Nhập giá sản phẩm"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Số lượng</Text>
        <TextInput
          style={styles.input}
          value={formData.quantity}
          onChangeText={(text) => handleInputChange('quantity', text)}
          placeholder="Nhập số lượng"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>CẬP NHẬT SẢN PHẨM</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditShoeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    titleUnderline: {
        width: '60%',
        height: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    sizeSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 10,
    },
    sizeButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    selectedSizeButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    sizeButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
    },
    selectedSizeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    submitButton: { 
        backgroundColor: '#007AFF', 
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#99b3ff',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});