import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { shoeService } from './shoeService';

const ShoeListScreen = ({ navigation }) => {
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchShoes = async () => {
        try {
            if (!refreshing) setLoading(true); 

            const response = await shoeService.getAllShoes();
            
            if (response && response.status === 200) {
                setShoes(response.data);
            } else {
                Alert.alert('Lỗi', `Không thể tải danh sách sản phẩm (Status: ${response?.status})`);
            }
        } catch (error) {
            console.error('Lỗi tải danh sách sản phẩm:', error); 
            Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchShoes();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchShoes();
    };

    const handleDeleteShoe = async (id, productName) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa "${productName}" không?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await shoeService.deleteShoe(id);
                            
                            if (response && (response.status === 200 || response.status === 204)) { 
                                Alert.alert('Thành công', 'Đã xóa sản phẩm!');
                                fetchShoes(); 
                            } else {
                                console.warn('Phản hồi xóa không thành công', response);
                                Alert.alert('Lỗi', `Không thể xóa sản phẩm (Status: ${response?.status})`);
                            }
                        } catch (error) {
                            console.error('Lỗi khi thực hiện xóa:', error);
                            Alert.alert('Lỗi', 'Không thể xóa sản phẩm! Vui lòng kiểm tra lại');
                        }
                    }
                }
            ]
        );
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return '0 đ';
        return `${Number(price).toLocaleString('vi-VN')} đ`;
    };

    const renderShoeItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.productCode}>{item.productCode || item.id}</Text>

            {item.size && (
                <View style={styles.sizeBadge}>
                    <Text style={styles.sizeText}>Size: {item.size}</Text>
                </View>
            )}

            <Text style={styles.productName}>{item.productName}</Text>

            <Text style={styles.price}>{formatPrice(item.price)}</Text>

            <View style={styles.bottomRow}>
                <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate("EditShoe", { shoe: item })}
                    >
                        <Text style={styles.actionText}>Sửa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteShoe(item.id, item.productName || item.tenSanPham)} 
                    >
                        <Text style={styles.actionText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );

    return (
        <View style={styles.container}>

            <View style={styles.titleArea}>
                <View style={styles.titleGroup}>
                    <Text style={styles.title}>DANH SÁCH SẢN PHẨM</Text>
                    <View style={styles.titleUnderline} />
                </View>
            </View>

            <View style={styles.buttonArea}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddShoe')}
                >
                    <Text style={styles.addButtonText}>+ Thêm mới</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={shoes}
                renderItem={renderShoeItem}
                keyExtractor={(item) => item.id.toString()} 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingHorizontal: 4 }}
            />
        </View>
    );
};
export default ShoeListScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingTop: 10,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },


    titleArea: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    titleGroup: {
        width: 250,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    titleUnderline: {
        height: 3,
        width: '80%',
        backgroundColor: '#007AFF',
        marginBottom: 10,
    },


    buttonArea: {
        paddingHorizontal: 16,
        marginBottom: 10,
        alignItems: 'flex-end',
    },
    addButton: {
        backgroundColor: "#28a745",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 5,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },


    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productCode: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#28a745",
        marginTop: 5,
        marginBottom: 10,
    },
    sizeBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    sizeText: {
        fontSize: 12,
        color: '#555',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    quantityText: {
        fontSize: 14,
        color: "#555",
        alignSelf: 'center',
    },
    actions: {
        flexDirection: "row",
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: "#ffc107",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginLeft: 8,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginLeft: 8,
    },
    actionText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
});