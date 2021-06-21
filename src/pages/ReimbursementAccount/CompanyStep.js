import _ from 'underscore';
import lodashGet from 'lodash/get';
import React from 'react';
import {View, ScrollView} from 'react-native';
import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import CONST from '../../CONST';
import {goToWithdrawalAccountSetupStep, setupWithdrawalAccount} from '../../libs/actions/BankAccounts';
import Navigation from '../../libs/Navigation/Navigation';
import Text from '../../components/Text';
import TextInputWithLabel from '../../components/TextInputWithLabel';
import styles from '../../styles/styles';
import Button from '../../components/Button';
import FixedFooter from '../../components/FixedFooter';
import CheckboxWithLabel from '../../components/CheckboxWithLabel';
import TextLink from '../../components/TextLink';
import Picker from '../../components/Picker';
import StatePicker from '../../components/StatePicker';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import Growl from '../../libs/Growl';

class CompanyStep extends React.Component {
    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);

        this.state = {
            companyName: lodashGet(props, ['achData', 'companyName'], ''),
            addressStreet: lodashGet(props, ['achData', 'addressStreet'], ''),
            addressCity: lodashGet(props, ['achData', 'addressCity'], ''),
            addressState: lodashGet(props, ['achData', 'addressState'], ''),
            addressZipCode: lodashGet(props, ['achData', 'addressZipCode'], ''),
            companyPhone: lodashGet(props, ['achData', 'companyPhone'], ''),
            website: lodashGet(props, ['achData', 'website'], ''),
            companyTaxID: lodashGet(props, ['achData', 'companyTaxID'], ''),
            incorporationType: lodashGet(props, ['achData', 'incorporationType'], ''),
            incorporationDate: lodashGet(props, ['achData', 'incorporationDate'], ''),
            incorporationState: lodashGet(props, ['achData', 'incorporationState'], ''),
            industryCode: lodashGet(props, ['achData', 'industryCode'], ''),
            hasNoConnectionToCannabis: lodashGet(props, ['achData', 'hasNoConnectionToCannabis'], false),
            password: '',
        };
    }

    validate() {
        // @TODO check more than just the password
        if (!this.state.password.trim()) {
            Growl.show(this.props.translate('common.passwordCannotBeBlank'), CONST.GROWL.ERROR);
            return false;
        }

        return true;
    }

    submit() {
        if (!this.validate()) {
            return;
        }

        setupWithdrawalAccount({...this.state});
    }

    render() {
        const shouldDisableCompanyName = Boolean(this.props.achData.bankAccountID && this.props.achData.companyName);
        const shouldDisableCompanyTaxID = Boolean(this.props.achData.bankAccountID && this.props.achData.companyTaxID);
        return (
            <>
                <HeaderWithCloseButton
                    title={this.props.translate('companyStep.headerTitle')}
                    shouldShowBackButton
                    onBackButtonPress={() => goToWithdrawalAccountSetupStep(CONST.BANK_ACCOUNT.STEP.BANK_ACCOUNT)}
                    onCloseButtonPress={Navigation.dismissModal}
                />
                <ScrollView style={[styles.flex1, styles.w100]}>
                    <View style={[styles.p4]}>
                        <View style={[styles.alignItemsCenter]}>
                            <Text>{this.props.translate('companyStep.subtitle')}</Text>
                        </View>
                        <TextInputWithLabel
                            label={this.props.translate('companyStep.legalBusinessName')}
                            containerStyles={[styles.mt4]}
                            onChangeText={companyName => this.setState({companyName})}
                            value={this.state.companyName}
                            disabled={shouldDisableCompanyName}
                        />
                        <TextInputWithLabel
                            label={this.props.translate('common.companyAddressNoPO')}
                            containerStyles={[styles.mt4]}
                            onChangeText={addressStreet => this.setState({addressStreet})}
                            value={this.state.addressStreet}
                        />
                        <View style={[styles.flexRow, styles.mt4]}>
                            <View style={[styles.flex2, styles.mr2]}>
                                <TextInputWithLabel
                                    label={this.props.translate('common.city')}
                                    onChangeText={addressCity => this.setState({addressCity})}
                                    value={this.state.addressCity}
                                />
                            </View>
                            <View style={[styles.flex1]}>
                                <Text style={[styles.formLabel]}>{this.props.translate('common.state')}</Text>
                                <StatePicker
                                    onChange={addressState => this.setState({addressState})}
                                    value={this.state.addressState}
                                />
                            </View>
                        </View>
                        <TextInputWithLabel
                            label={this.props.translate('common.zip')}
                            containerStyles={[styles.mt4]}
                            onChangeText={addressZipCode => this.setState({addressZipCode})}
                            value={this.state.addressZipCode}
                        />
                        <TextInputWithLabel
                            label={this.props.translate('common.phoneNumber')}
                            containerStyles={[styles.mt4]}
                            keyboardType={CONST.KEYBOARD_TYPE.PHONE_PAD}
                            onChangeText={companyPhone => this.setState({companyPhone})}
                            value={this.state.companyPhone}
                        />
                        <TextInputWithLabel
                            label={this.props.translate('companyStep.companyWebsite')}
                            containerStyles={[styles.mt4]}
                            onChangeText={website => this.setState({website})}
                            value={this.state.website}
                        />
                        <TextInputWithLabel
                            label={this.props.translate('companyStep.taxIDNumber')}
                            containerStyles={[styles.mt4]}
                            keyboardType={CONST.KEYBOARD_TYPE.PHONE_PAD}
                            onChangeText={companyTaxID => this.setState({companyTaxID})}
                            value={this.state.companyTaxID}
                            disabled={shouldDisableCompanyTaxID}
                        />
                        <Text style={[styles.formLabel, styles.mt4]}>
                            {this.props.translate('companyStep.companyType')}
                        </Text>
                        <Picker
                            items={_.map(CONST.INCORPORATION_TYPES, (label, value) => ({value, label}))}
                            onChange={incorporationType => this.setState({incorporationType})}
                            value={this.state.incorporationType}
                            placeholder={{value: '', label: 'Type'}}
                        />
                        <View style={[styles.flexRow, styles.mt4]}>
                            <View style={[styles.flex2, styles.mr2]}>
                                {/* TODO: Replace with date picker */}
                                <TextInputWithLabel
                                    label={this.props.translate('companyStep.incorporationDate')}
                                    onChangeText={incorporationDate => this.setState({incorporationDate})}
                                    value={this.state.incorporationDate}
                                />
                            </View>
                            <View style={[styles.flex1]}>
                                <Text style={[styles.formLabel]}>{this.props.translate('common.state')}</Text>
                                <StatePicker
                                    onChange={incorporationState => this.setState({incorporationState})}
                                    value={this.state.incorporationState}
                                />
                            </View>
                        </View>
                        {/* TODO: Replace with NAICS picker */}
                        <TextInputWithLabel
                            label={this.props.translate('companyStep.industryClassificationCode')}
                            helpLinkText={this.props.translate('common.whatThis')}
                            helpLinkURL="https://www.naics.com/search/"
                            containerStyles={[styles.mt4]}
                            onChangeText={industryCode => this.setState({industryCode})}
                            value={this.state.industryCode}
                        />
                        <TextInputWithLabel
                            label={`Expensify ${this.props.translate('common.password')}`}
                            containerStyles={[styles.mt4]}
                            secureTextEntry
                            autoCompleteType="password"
                            textContentType="password"
                            onChangeText={password => this.setState({password})}
                            value={this.state.password}
                        />
                        <CheckboxWithLabel
                            isChecked={this.state.hasNoConnectionToCannabis}
                            onPress={() => this.setState(prevState => ({
                                hasNoConnectionToCannabis: !prevState.hasNoConnectionToCannabis,
                            }))}
                            LabelComponent={() => (
                                <>
                                    <Text>{`${this.props.translate('companyStep.confirmCompanyIsNot')} `}</Text>
                                    <TextLink
                                        // eslint-disable-next-line max-len
                                        href="https://community.expensify.com/discussion/6191/list-of-restricted-businesses"
                                    >
                                        {`${this.props.translate('companyStep.listOfRestrictedBusinesses')}.`}
                                    </TextLink>
                                </>
                            )}
                            style={[styles.mt4]}
                        />
                    </View>
                </ScrollView>
                <FixedFooter style={[styles.mt5]}>
                    <Button
                        success
                        onPress={this.submit}
                        style={[styles.w100]}
                        text={this.props.translate('common.saveAndContinue')}
                    />
                </FixedFooter>
            </>
        );
    }
}

CompanyStep.propTypes = withLocalizePropTypes;

export default withLocalize(CompanyStep);
