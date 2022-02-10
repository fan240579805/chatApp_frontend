import React from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const ModalCPM: React.FC<ModalProps> = ({
  modalVisible,
  setModalVisible,
  children,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.btnWrap}>
              <TouchableHighlight
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>X</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.childrenWrap}>{children}</View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    marginTop: '60%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnWrap: {
    flexDirection: 'row-reverse',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    width: 20,
    height: 20,
    textAlign: 'center',
  },
  childrenWrap: {},
});

export default ModalCPM;
