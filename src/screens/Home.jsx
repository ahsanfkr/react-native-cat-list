import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Home = () => {
  const [cats, setCats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);

  const getCats = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://api.thecatapi.com/v1/breeds?page=${currentPage}&limit=10`,
      );
      setCats([...cats, ...res.data]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const filteredCats = cats.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const StarIndicator = ({value}) => {
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        {[...Array(5)].map((_, i) => (
          <Text
            key={i}
            style={{color: i < value ? 'gold' : 'gray', fontSize: 10}}>
            ★
          </Text>
        ))}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const isExpanded = expandedItems.includes(index);
    return (
      <TouchableOpacity onPress={() => handleItemPress(index)}>
        <View style={styles.itemWrapperStyle}>
          <Image
            style={styles.itemImageStyle}
            source={{
              uri: `https://cdn2.thecatapi.com/images/${item.reference_image_id}.jpg`,
            }}
          />
          <View>
            <Text style={styles.catName}>{item.name}</Text>
            <View style={styles.originWrapper}>
              <Text style={styles.catOrigin}>{item.origin} </Text>
              <Image
                style={{width: 16, height: 16}}
                source={{
                  uri: `https://flagsapi.com/${item.country_code}/shiny/64.png`,
                }}
              />
            </View>
            {!isExpanded && (
              <View style={styles.tapDetail}>
                <Text style={styles.tapDetailText}>see detail 🐾</Text>
              </View>
            )}
            {isExpanded && (
              <View style={styles.expandContainer}>
                <View style={styles.descriptionWrapper}>
                  <Text style={styles.catDescription}>{item.description}</Text>
                </View>
                <Text style={styles.catInformation}>
                  Weight : {item.weight.imperial} pound / {item.weight.metric}{' '}
                  kg
                </Text>
                <Text style={styles.catInformation}>
                  Life span : {item.life_span} years
                </Text>
                <Text style={styles.catInformation}>
                  Character : {item.temperament}
                </Text>
                <View style={styles.metricWrapper}>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Intelligence : </Text>
                    </View>
                    <StarIndicator value={item.intelligence} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Adaptability : </Text>
                    </View>
                    <StarIndicator value={item.adaptability} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Energy : </Text>
                    </View>
                    <StarIndicator value={item.energy_level} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Grooming : </Text>
                    </View>
                    <StarIndicator value={item.grooming} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Health Issues :</Text>
                    </View>
                    <StarIndicator value={item.health_issues} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>
                        Shedding Level :
                      </Text>
                    </View>
                    <StarIndicator value={item.shedding_level} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>Social Needs : </Text>
                    </View>
                    <StarIndicator value={item.social_needs} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>
                        Stranger Friendly :
                      </Text>
                    </View>
                    <StarIndicator value={item.stranger_friendly} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>
                        Child Friendly :{' '}
                      </Text>
                    </View>
                    <StarIndicator value={item.child_friendly} />
                  </View>
                  <View style={styles.starWrap}>
                    <View style={styles.spacer}>
                      <Text style={styles.catInformation}>
                        Hypoallergenic :{' '}
                      </Text>
                    </View>
                    <StarIndicator value={item.hypoallergenic} />
                  </View>
                </View>
                <View style={styles.hyperlinkWrapper}>
                  <Text style={styles.reference}>Other reference: </Text>
                  <Text
                    onPress={() => Linking.openURL(`${item.wikipedia_url}`)}
                    style={styles.hyperlink}>
                    Wikipedia
                  </Text>
                  <Text
                    onPress={() => Linking.openURL(`${item.cfa_url}`)}
                    style={styles.hyperlink}>
                    CFA
                  </Text>
                  <Text
                    onPress={() => Linking.openURL(`${item.vetstreet_url}`)}
                    style={styles.hyperlink}>
                    Vetstreet
                  </Text>
                  <Text
                    onPress={() => Linking.openURL(`${item.vcahospitals_url}`)}
                    style={styles.hyperlink}>
                    VCA
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleItemPress = index => {
    const expandedIndex = expandedItems.indexOf(index);
    const isExpanded = expandedIndex !== -1;

    if (isExpanded) {
      setExpandedItems(expandedItems.filter(i => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="lightskyblue" />
      </View>
    ) : null;
  };

  const loadMoreCats = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    getCats();
  }, [currentPage]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Cat Collection</Text>
        <TextInput
          placeholder=" Search cat name..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FlatList
          data={filteredCats}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={loadMoreCats}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderLoader}
        />
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderColor: '#ddd',
  },
  itemImageStyle: {
    width: 75,
    height: 75,
    marginRight: 16,
    borderRadius: 8,
  },
  catName: {
    fontSize: 16,
    fontWeight: '500',
  },
  catOrigin: {
    fontSize: 10,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: '#eaeaea',
    marginHorizontal: 4,
    marginBottom: 12,
    padding: 8,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
  expandContainer: {
    borderWidth: 0,
    marginTop: 8,
    rowGap: 8,
    width: '86%',
  },
  descriptionWrapper: {
    backgroundColor: '#E8F6EC',
    borderColor: '#59C28E',
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
  },
  catDescription: {
    fontSize: 10,
    textAlign: 'justify',
  },
  catInformation: {
    fontSize: 10,
  },
  spacer: {
    width: '38%',
  },
  tapDetail: {
    height: 40,
    width: 240,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tapDetailText: {
    fontSize: 10,
    fontWeight: 200,
    fontStyle: 'italic',
  },
  starWrap: {
    display: 'flex',
    flexDirection: 'row',
  },
  originWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginTop: 4,
  },
  metricWrapper: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#F3C44C',
    backgroundColor: '#FFFEE4',
    padding: 4,
    rowGap: 8,
  },
  reference: {
    fontSize: 10,
  },
  hyperlink: {
    fontSize: 11,
    color: '#1253CD',
    textDecorationLine: 'underline',
  },
  hyperlinkWrapper: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 4,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
