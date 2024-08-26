import * as Popover from "@radix-ui/react-popover"

export default () => (
    <Popover.Root>
        <Popover.Trigger />
        <Popover.Anchor />
        <Popover.Portal>
            <Popover.Content>
                <Popover.Close />
                <Popover.Arrow />
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
)
