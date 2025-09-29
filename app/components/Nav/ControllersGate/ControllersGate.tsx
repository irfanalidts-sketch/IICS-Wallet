//import React from 'react';
//import { ControllersGateProps } from './types';
//import { useSelector } from 'react-redux';
//import { selectAppServicesReady } from '../../../reducers/user/selectors';
//import FoxLoader from '../../UI/FoxLoader';
//**
 //* A higher order component that gate keeps the children until the app services are finished loaded
 //*
 //* @param props - The props for the ControllersGate component
 //* @param props.children - The children to render
 //* @returns - The ControllersGate component
 //*/
//const ControllersGate: React.FC<ControllersGateProps> = ({
  //children,
//}: ControllersGateProps) => {
  //const appServicesReady = useSelector(selectAppServicesReady);

  //return (
    //<React.Fragment>
      //{appServicesReady ? children : <FoxLoader />}
    //</React.Fragment>
  //);
//};

//export default ControllersGate;
import React from 'react';
import { View, Image, StyleSheet } from 'react-native'; // ✅ Add this
import { ControllersGateProps } from './types';
import { useSelector } from 'react-redux';
import { selectAppServicesReady } from '../../../reducers/user/selectors';
// import FoxLoader from '../../UI/FoxLoader'; ✅ REMOVE this line

const ControllersGate: React.FC<ControllersGateProps> = ({
  children,
}: ControllersGateProps) => {
  const appServicesReady = useSelector(selectAppServicesReady);

  return (
    <>
      {appServicesReady ? children : (
        <View style={styles.loader}>
          <Image
            source={require('../../../images/branding/fox.png')} // ✅ This is your logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default ControllersGate;
