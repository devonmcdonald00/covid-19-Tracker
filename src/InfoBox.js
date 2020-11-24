import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, total, color, active, isRed, mode, ...props}) {
    return (
        <div>
            <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`} onClick={props.onClick}>
                <CardContent>
                    <Typography color='textSecondary' className='infoBox__title'>
                        {title}
                    </Typography>
                    <h2 className='infoBox__cases' style={{color: color}}>{cases}</h2>
                    <Typography color='textSecondary' className='infoBox__total'>
                        {!mode && total} {!mode && 'Total'}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox
