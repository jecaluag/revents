import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useField } from 'formik'
import { FormField, Label, List, Segment } from 'semantic-ui-react';

const segmentStyle = { 
  marginTop: 0,
  position: 'absolute',
  zIndex: 1000,
  width: '100%'
}

export default function TextInput({ label, options, ...props }) {
  const [ field, meta, helpers ] = useField(props)

  const handleSelect = adrs => {
    geocodeByAddress(adrs)
      .then(results => getLatLng(results[0]))
      .then(latLng => helpers.setValue({ address: adrs, latLng }))
      .catch(error => helpers.setError(error));
  };

  const handleBlur = e => {
    field.onBlur(e)
    if (!field.value.latLng) {
      helpers.setValue({ address: '', latLng: null })
    }
  }

  return (
    <PlacesAutocomplete
      value={field.value['address']}
      onChange={value => helpers.setValue({ address: value })}
      onSelect={value => handleSelect(value)}
      searchOptions={options}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <FormField error={meta.touched && !!meta.error}>
          <input 
            { ...getInputProps({
                name: field.name,
                onBlur: (e) => handleBlur(e),
                ...props 
              })
            } 
          />
          { meta.touched && meta.error ? (
            <Label basic color='red' style={{ borderStyle: 'none' }}>
              { meta.error['address'] }
            </Label>
          ) : null }
          { suggestions?.length > 0 && (
            <Segment loading={loading} style={segmentStyle}>
              <List selection>
                { suggestions.map(suggestion => (
                  <List.Item { ...getSuggestionItemProps(suggestion) } key={suggestion.placeId}>
                    <List.Header>
                      { suggestion.formattedSuggestion.mainText }
                    </List.Header>
                    <List.Description>
                      { suggestion.formattedSuggestion.secondaryText }
                    </List.Description>
                  </List.Item>
                )) }
              </List>
            </Segment>
          ) }
        </FormField>
      )}
    </PlacesAutocomplete>
  )
}
 